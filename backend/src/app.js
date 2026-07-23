const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const employees = require("./employees");
const authMiddleware = require("./middleware/auth");
const swaggerSpec = require("./swagger");
const {
  leaves,
  leaveTypes,
  leaveStatus,
  initializeLeaveBalance,
} = require("./leaves");

const users = [
  {
    id: 1,
    name: "Administrator",
    email: "admin@gmail.com",
    password: "Admin123456",
    role: "Admin",
  },
  {
    id: 2,
    name: "HR Manager",
    email: "hr@gmail.com",
    password: "Hr123456",
    role: "HR",
  },
];

const app = express();

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: true, message: "Sistem Manajemen Karyawan API is running" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@test.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login Success
 */
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Check if email exists
  const userByEmail = users.find((u) => u.email === email);

  if (!userByEmail) {
    return res.status(401).json({
      status: false,
      message: "Email belum terdaftar",
    });
  }

  // Check if password is correct
  if (userByEmail.password !== password) {
    return res.status(401).json({
      status: false,
      message: "Password salah",
    });
  }

  const user = userByEmail;

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "2m",
    },
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_REFRESH_SECRET || `${process.env.JWT_SECRET}_refresh`,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "1d",
    },
  );

  return res.json({
    status: true,
    message: "Login Success",
    data: {
      token,
      refreshToken,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh Access Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token Refreshed Successfully
 *       400:
 *         description: Refresh token is required
 *       401:
 *         description: Invalid or expired refresh token
 */
app.post("/api/auth/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      status: false,
      message: "Refresh token harus diisi",
    });
  }

  try {
    const refreshSecret =
      process.env.JWT_REFRESH_SECRET || `${process.env.JWT_SECRET}_refresh`;
    const decoded = jwt.verify(refreshToken, refreshSecret);

    const user = users.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "User tidak ditemukan",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "2m",
      },
    );

    const newRefreshToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      refreshSecret,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "1d",
      },
    );

    return res.json({
      status: true,
      message: "Token refreshed successfully",
      data: {
        token,
        refreshToken: newRefreshToken,
      },
    });
  } catch {
    return res.status(401).json({
      status: false,
      message: "Refresh token tidak valid atau telah kadaluarsa",
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "Employee Assessment API Running",
  });
});

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Dashboard
 *     summary: Dashboard Summary
 *     responses:
 *       200:
 *         description: Dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEmployee:
 *                   type: integer
 *                   example: 100
 *                 activeEmployee:
 *                   type: integer
 *                   example: 68
 *                 inactiveEmployee:
 *                   type: integer
 *                   example: 32
 *                 totalSalary:
 *                   type: integer
 *                   example: 474315519
 *                 averageSalary:
 *                   type: integer
 *                   example: 4743155
 */
app.get("/api/dashboard", authMiddleware, (req, res) => {
  const activeEmployee = employees.filter(
    (item) => item.status === "Active",
  ).length;
  const inactiveEmployee = employees.filter(
    (item) => item.status === "Inactive",
  ).length;

  const totalSalary = employees.reduce((acc, item) => acc + item.salary, 0);

  const averageSalary =
    employees.length > 0 ? Math.round(totalSalary / employees.length) : 0;

  res.json({
    totalEmployee: employees.length,
    activeEmployee,
    inactiveEmployee,
    totalSalary,
    averageSalary,
  });
});

/**
 * @swagger
 * /api/master/departments:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Master Data
 *     summary: Get Departments
 *     description: Get list of available departments
 *     responses:
 *       200:
 *         description: Department list retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - IT
 *                 - Finance
 *                 - HRD
 *                 - Marketing
 *                 - Operations
 */
app.get("/api/master/departments", authMiddleware, (req, res) => {
  res.json({
    status: true,
    data: ["IT", "Finance", "HRD", "Marketing", "Operations"],
  });
});

/**
 * @swagger
 * /api/master/positions:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Master Data
 *     summary: Get Positions
 *     description: Get list of available employee positions
 *     responses:
 *       200:
 *         description: Position list retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - Frontend Developer
 *                 - Backend Developer
 *                 - Fullstack Developer
 *                 - QA Engineer
 *                 - UI/UX Designer
 *                 - DevOps Engineer
 *                 - Finance Staff
 *                 - HR Staff
 *                 - Marketing Specialist
 */
app.get("/api/master/positions", authMiddleware, (req, res) => {
  res.json({
    status: true,
    data: [
      "Frontend Developer",
      "Backend Developer",
      "Fullstack Developer",
      "QA Engineer",
      "UI/UX Designer",
      "DevOps Engineer",
      "Finance Staff",
      "HR Staff",
      "Marketing Specialist",
    ],
  });
});

/**
 * @swagger
 * /api/master/genders:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Master Data
 *     summary: Get Genders
 *     description: Get list of available genders
 *     responses:
 *       200:
 *         description: Gender list retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - Male
 *                 - Female
 */
app.get("/api/master/genders", authMiddleware, (req, res) => {
  res.json({
    status: true,
    data: ["Male", "Female"],
  });
});

/**
 * @swagger
 * /api/employees:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Employee
 *     summary: Get Employees
 *     description: Get employee list with pagination, search, filter and sorting
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: john
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - Active
 *             - Inactive
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *              - id
 *              - employeeCode
 *              - fullName
 *              - department
 *              - position
 *              - salary
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *     responses:
 *       200:
 *         description: Employee list retrieved successfully
 */
app.get("/api/employees", authMiddleware, (req, res) => {
  let {
    page = 1,
    limit = 10,
    search = "",
    department,
    sort = "id",
    order = "asc",
    status,
  } = req.query;

  page = Number(page);
  limit = Number(limit);

  let data = [...employees];

  const allowedSortFields = [
    "id",
    "employeeCode",
    "fullName",
    "department",
    "position",
    "salary",
    "status",
  ];

  if (!allowedSortFields.includes(sort)) {
    sort = "id";
  }

  if (department) {
    data = data.filter((item) => item.department === department);
  }

  if (search) {
    data = data.filter(
      (item) =>
        item.fullName.toLowerCase().includes(search.toLowerCase()) ||
        item.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (status) {
    data = data.filter((item) => item.status === status);
  }

  data.sort((a, b) => {
    const valueA = a[sort];
    const valueB = b[sort];

    if (typeof valueA === "string") {
      return order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return order === "asc" ? valueA - valueB : valueB - valueA;
  });

  const totalData = data.length;
  const totalPage = Math.ceil(totalData / limit);

  const start = (page - 1) * limit;

  const result = data.slice(start, start + limit);

  res.json({
    status: true,
    data: result,
    pagination: {
      page,
      limit,
      totalData,
      totalPage,
    },
  });
});

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Employee
 *     summary: Get Employee Detail
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Employee detail retrieved successfully
 *       404:
 *         description: Employee not found
 */
app.get("/api/employees/:id", authMiddleware, (req, res) => {
  const employee = employees.find((x) => x.id == req.params.id);

  if (!employee) {
    return res.status(404).json({
      status: false,
      message: "Employee not found",
    });
  }

  res.json({
    status: true,
    data: employee,
  });
});

/**
 * @swagger
 * /api/employees:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Employee
 *     summary: Create Employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeCode
 *               - fullName
 *               - email
 *               - phoneNumber
 *               - gender
 *               - department
 *               - position
 *               - salary
 *               - status
 *             properties:
 *               employeeCode:
 *                 type: string
 *                 example: EMP101
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@test.com
 *               phoneNumber:
 *                 type: string
 *                 example: 081234567890
 *               gender:
 *                 type: string
 *                 enum:
 *                   - Male
 *                   - Female
 *               birthDate:
 *                 type: string
 *                 example: 1995-05-10
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: Jl. Sudirman No. 10
 *                   city:
 *                     type: string
 *                     example: Jakarta
 *                   province:
 *                     type: string
 *                     example: DKI Jakarta
 *                   postalCode:
 *                     type: string
 *                     example: 10220
 *               department:
 *                 type: string
 *                 example: IT
 *               position:
 *                 type: string
 *                 example: Frontend Developer
 *               joinDate:
 *                 type: string
 *                 example: 2024-01-15
 *               salary:
 *                 type: number
 *                 example: 8500000
 *               status:
 *                 type: string
 *                 enum:
 *                   - Active
 *                   - Inactive
 *               emergencyContact:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Jane Doe
 *                   relationship:
 *                     type: string
 *                     example: Wife
 *                   phoneNumber:
 *                     type: string
 *                     example: 081298765432
 *     responses:
 *       201:
 *         description: Employee created successfully
 */
app.post("/api/employees", authMiddleware, (req, res) => {
  const requiredFields = ["employeeCode", "fullName", "email", "gender"];

  const missingFields = requiredFields.filter(
    (field) =>
      req.body[field] === undefined ||
      req.body[field] === null ||
      req.body[field] === "",
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: false,
      message: "Validation Error",
      errors: missingFields.map((field) => `${field} is required`),
    });
  }

  if (req.body.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({
        status: false,
        message: "Email tidak valid",
      });
    }
  }

  if (!["Male", "Female"].includes(req.body.gender)) {
    return res.status(400).json({
      status: false,
      message: "Invalid gender",
    });
  }

  if (Number(req.body.salary) <= 0) {
    return res.status(400).json({
      status: false,
      message: "Salary must be greater than 0",
    });
  }

  const existingEmail = employees.find((item) => item.email === req.body.email);

  if (existingEmail) {
    return res.status(400).json({
      status: false,
      message: "Email already exists",
    });
  }

  const existingEmployee = employees.find(
    (item) => item.employeeCode === req.body.employeeCode,
  );

  if (existingEmployee) {
    return res.status(400).json({
      status: false,
      message: "Employee Code already exists",
    });
  }

  const newEmployee = {
    id: employees.length + 1,
    ...req.body,
  };

  employees.push(newEmployee);

  res.status(201).json({
    status: true,
    message: "Employee berhasil ditambahkan",
    data: newEmployee,
  });
});

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Employee
 *     summary: Update Employee
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeCode:
 *                 type: string
 *                 example: EMP001
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@test.com
 *               phoneNumber:
 *                 type: string
 *                 example: 081234567890
 *               gender:
 *                 type: string
 *                 enum:
 *                   - Male
 *                   - Female
 *               birthDate:
 *                 type: string
 *                 example: 1995-05-10
 *               department:
 *                 type: string
 *                 example: IT
 *               position:
 *                 type: string
 *                 example: Frontend Developer
 *               joinDate:
 *                 type: string
 *                 example: 2024-01-15
 *               salary:
 *                 type: number
 *                 example: 8500000
 *               status:
 *                 type: string
 *                 enum:
 *                   - Active
 *                   - Inactive
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       404:
 *         description: Employee not found
 */
app.put("/api/employees/:id", authMiddleware, (req, res) => {
  const index = employees.findIndex((x) => x.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({
      status: false,
      message: "Employee not found",
    });
  }

  // Validasi employeeCode (Kecuali milik dirinya sendiri)
  const existingEmployee = employees.find(
    (item) =>
      item.employeeCode === req.body.employeeCode && item.id != req.params.id,
  );

  if (existingEmployee) {
    return res.status(400).json({
      status: false,
      message: "Employee Code already exists",
    });
  }

  // Validasi email (Kecuali milik dirinya sendiri)
  const existingEmail = employees.find(
    (item) => item.email === req.body.email && item.id != req.params.id,
  );

  if (existingEmail) {
    return res.status(400).json({
      status: false,
      message: "Email already exists",
    });
  }

  if (req.body.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({
        status: false,
        message: "Email tidak valid",
      });
    }
  }

  if (Number(req.body.salary) <= 0) {
    return res.status(400).json({
      status: false,
      message: "Salary must be greater than 0",
    });
  }

  if (!["Male", "Female"].includes(req.body.gender)) {
    return res.status(400).json({
      status: false,
      message: "Invalid gender",
    });
  }

  employees[index] = {
    ...employees[index],
    ...req.body,
  };

  res.json({
    status: true,
    message: "Employee berhasil diupdate",
    data: employees[index],
  });
});

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Employee
 *     summary: Delete Employee
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 */
app.delete("/api/employees/:id", authMiddleware, (req, res) => {
  const index = employees.findIndex((x) => x.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({
      status: false,
      message: "Employee not found",
    });
  }

  employees.splice(index, 1);

  res.json({
    status: true,
    message: "Employee berhasil dihapus",
  });
});

/**
 * @swagger
 * /api/leave/balance/{employeeId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Leave Management
 *     summary: Get Leave Balance
 *     description: Get leave quota and usage for specific employee
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: search
 *         required: false
 *         description: Optional search value to include in each leave balance entry
 *         schema:
 *           type: string
 *           example: annual
 *     responses:
 *       200:
 *         description: Leave balance retrieved successfully
 *       404:
 *         description: Employee not found
 */
app.get("/api/leave/balance/:employeeId", authMiddleware, (req, res) => {
  const employee = employees.find((x) => x.id == req.params.employeeId);

  if (!employee) {
    return res.status(404).json({
      status: false,
      message: "Employee tidak ditemukan",
    });
  }

  // Hitung leave usage dari approved leaves
  const search = req.query.search || "";
  const balance = initializeLeaveBalance(employee.id, search);

  const approvedLeaves = leaves.filter(
    (leave) =>
      leave.employeeId == employee.id && leave.status === leaveStatus.APPROVED,
  );

  approvedLeaves.forEach((leave) => {
    const days = leave.durationDays;
    if (balance[leave.type]) {
      balance[leave.type].used += days;
      balance[leave.type].remaining -= days;
    }
  });

  res.json({
    status: true,
    data: {
      employeeId: employee.id,
      employeeName: employee.fullName,
      balance,
    },
  });
});

/**
 * @swagger
 * /api/leave/request:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Leave Management
 *     summary: Create Leave Request
 *     description: Employee create a new leave request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - type
 *               - startDate
 *               - endDate
 *               - reason
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 example: 1
 *               type:
 *                 type: string
 *                 enum:
 *                   - ANNUAL
 *                   - SICK
 *                   - PERSONAL
 *                   - BEREAVEMENT
 *                 example: ANNUAL
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-07-10
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-07-15
 *               reason:
 *                 type: string
 *                 example: Annual vacation
 *               notes:
 *                 type: string
 *                 example: Additional notes
 *     responses:
 *       201:
 *         description: Leave request created successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Employee not found
 */
app.post("/api/leave/request", authMiddleware, (req, res) => {
  const { employeeId, type, startDate, endDate, reason, notes } = req.body;

  // Validasi field required
  if (!employeeId || !type || !startDate || !endDate || !reason) {
    return res.status(400).json({
      status: false,
      message:
        "Field employeeId, type, startDate, endDate, dan reason harus diisi",
    });
  }

  // Validasi employee exists
  const employee = employees.find((x) => x.id == employeeId);
  if (!employee) {
    return res.status(404).json({
      status: false,
      message: "Employee tidak ditemukan",
    });
  }

  // Validasi leave type
  if (!Object.keys(leaveTypes).includes(type)) {
    return res.status(400).json({
      status: false,
      message: `Tipe cuti tidak valid. Pilihan: ${Object.keys(leaveTypes).join(", ")}`,
    });
  }

  // Validasi date format dan logic
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      status: false,
      message: "Format tanggal tidak valid (gunakan YYYY-MM-DD)",
    });
  }

  if (start > end) {
    return res.status(400).json({
      status: false,
      message: "Tanggal mulai tidak boleh lebih besar dari tanggal akhir",
    });
  }

  if (start < new Date()) {
    return res.status(400).json({
      status: false,
      message: "Tanggal mulai tidak boleh di masa lalu",
    });
  }

  // Hitung duration dalam hari (excluding weekends)
  let durationDays = 0;
  let current = new Date(start);
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Exclude Sunday (0) dan Saturday (6)
      durationDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  // Cek duplikasi request dengan tanggal yang sama
  const existingRequest = leaves.find(
    (leave) =>
      leave.employeeId == employeeId &&
      leave.type === type &&
      leave.startDate === startDate &&
      leave.endDate === endDate &&
      leave.status === leaveStatus.PENDING,
  );

  if (existingRequest) {
    return res.status(400).json({
      status: false,
      message: "Leave request dengan tanggal sama sedang pending approval",
    });
  }

  // Cek overlap dengan approved leave
  const overlappingLeave = leaves.find(
    (leave) =>
      leave.employeeId == employeeId &&
      leave.status === leaveStatus.APPROVED &&
      new Date(leave.startDate) <= end &&
      new Date(leave.endDate) >= start,
  );

  if (overlappingLeave) {
    return res.status(400).json({
      status: false,
      message: "Tanggal cuti overlap dengan cuti yang sudah disetujui",
    });
  }

  const newLeave = {
    id: leaves.length + 1,
    employeeId: Number(employeeId),
    employeeName: employee.fullName,
    type,
    startDate,
    endDate,
    durationDays,
    reason,
    notes: notes || "",
    status: leaveStatus.PENDING,
    createdAt: new Date().toISOString(),
    approvedAt: null,
    approvedBy: null,
    rejectionReason: null,
  };

  leaves.push(newLeave);

  res.status(201).json({
    status: true,
    message: "Leave request berhasil dibuat",
    data: newLeave,
  });
});

/**
 * @swagger
 * /api/leave/requests:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Leave Management
 *     summary: Get All Leave Requests
 *     description: Get all leave requests (admin only)
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - Pending
 *             - Approved
 *             - Rejected
 *             - Cancelled
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: annual
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Leave requests retrieved successfully
 */
app.get("/api/leave/requests", authMiddleware, (req, res) => {
  let { status, search = "", page = 1, limit = 10 } = req.query;

  page = Number(page);
  limit = Number(limit);

  let data = [...leaves];

  if (status) {
    data = data.filter((leave) => leave.status === status);
  }

  if (search) {
    const normalizedSearch = search.toLowerCase();
    data = data.filter((leave) => {
      const searchableFields = [
        leave.employeeName,
        leave.type,
        leave.reason,
        leave.status,
        String(leave.employeeId),
      ];

      return searchableFields.some((field) =>
        String(field).toLowerCase().includes(normalizedSearch),
      );
    });
  }

  // Sort by createdAt descending
  data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalData = data.length;
  const totalPage = Math.ceil(totalData / limit);
  const start = (page - 1) * limit;
  const result = data.slice(start, start + limit);

  res.json({
    status: true,
    data: result,
    pagination: {
      page,
      limit,
      totalData,
      totalPage,
    },
  });
});

/**
 * @swagger
 * /api/leave/my-requests:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Leave Management
 *     summary: Get My Leave Requests
 *     description: Get current user's leave requests
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - Pending
 *             - Approved
 *             - Rejected
 *             - Cancelled
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Leave requests retrieved successfully
 */
app.get("/api/leave/my-requests", authMiddleware, (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  // Untuk demo, gunakan employeeId dari query atau hardcode
  // Di production, ambil dari token JWT
  const employeeId = req.query.employeeId || 1;

  let data = leaves.filter((leave) => leave.employeeId == employeeId);

  if (status) {
    data = data.filter((leave) => leave.status === status);
  }

  data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalData = data.length;
  const totalPage = Math.ceil(totalData / Number(limit));
  const start = (Number(page) - 1) * Number(limit);
  const result = data.slice(start, start + Number(limit));

  res.json({
    status: true,
    data: result,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalData,
      totalPage,
    },
  });
});

/**
 * @swagger
 * /api/leave/{id}/approve:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Leave Management
 *     summary: Approve Leave Request
 *     description: Manager/Admin approve a leave request
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               approvalNotes:
 *                 type: string
 *                 example: Approved
 *     responses:
 *       200:
 *         description: Leave request approved successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Leave request not found
 */
app.put("/api/leave/:id/approve", authMiddleware, (req, res) => {
  const leaveId = Number(req.params.id);
  const leave = leaves.find((x) => x.id === leaveId);

  if (!leave) {
    return res.status(404).json({
      status: false,
      message: "Leave request tidak ditemukan",
    });
  }

  if (leave.status !== leaveStatus.PENDING) {
    return res.status(400).json({
      status: false,
      message: `Leave request tidak bisa disetujui (status: ${leave.status})`,
    });
  }

  leave.status = leaveStatus.APPROVED;
  leave.approvedAt = new Date().toISOString();
  leave.approvedBy = "Admin"; // Di production ambil dari token

  res.json({
    status: true,
    message: "Leave request berhasil disetujui",
    data: leave,
  });
});

/**
 * @swagger
 * /api/leave/{id}/reject:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Leave Management
 *     summary: Reject Leave Request
 *     description: Manager/Admin reject a leave request
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rejectionReason
 *             properties:
 *               rejectionReason:
 *                 type: string
 *                 example: Sudah ada yang cuti di periode ini
 *     responses:
 *       200:
 *         description: Leave request rejected successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Leave request not found
 */
app.put("/api/leave/:id/reject", authMiddleware, (req, res) => {
  const { rejectionReason } = req.body;
  const leaveId = Number(req.params.id);

  if (!rejectionReason) {
    return res.status(400).json({
      status: false,
      message: "rejectionReason harus diisi",
    });
  }

  const leave = leaves.find((x) => x.id === leaveId);

  if (!leave) {
    return res.status(404).json({
      status: false,
      message: "Leave request tidak ditemukan",
    });
  }

  if (leave.status !== leaveStatus.PENDING) {
    return res.status(400).json({
      status: false,
      message: `Leave request tidak bisa ditolak (status: ${leave.status})`,
    });
  }

  leave.status = leaveStatus.REJECTED;
  leave.rejectionReason = rejectionReason;
  leave.approvedAt = new Date().toISOString();

  res.json({
    status: true,
    message: "Leave request berhasil ditolak",
    data: leave,
  });
});

/**
 * @swagger
 * /api/leave/{id}/cancel:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Leave Management
 *     summary: Cancel Leave Request
 *     description: Employee cancel their own leave request
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cancellationReason:
 *                 type: string
 *                 example: Rencana berubah
 *     responses:
 *       200:
 *         description: Leave request cancelled successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Leave request not found
 */
app.put("/api/leave/:id/cancel", authMiddleware, (req, res) => {
  const leaveId = Number(req.params.id);
  const leave = leaves.find((x) => x.id === leaveId);

  if (!leave) {
    return res.status(404).json({
      status: false,
      message: "Leave request tidak ditemukan",
    });
  }

  if (![leaveStatus.PENDING, leaveStatus.APPROVED].includes(leave.status)) {
    return res.status(400).json({
      status: false,
      message: `Leave request tidak bisa dibatalkan (status: ${leave.status})`,
    });
  }

  leave.status = leaveStatus.CANCELLED;
  leave.approvedAt = new Date().toISOString();

  res.json({
    status: true,
    message: "Leave request berhasil dibatalkan",
    data: leave,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
