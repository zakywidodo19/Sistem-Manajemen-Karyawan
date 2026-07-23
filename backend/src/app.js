const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_default_123";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "super_secret_jwt_refresh_key_default_123";

const prisma = require("./lib/prisma");
const authMiddleware = require("./middleware/auth");
const swaggerSpec = require("./swagger");
const {
  leaveTypes,
  leaveStatus,
  initializeLeaveBalance,
} = require("./leaves");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors());
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
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: Admin123456
 *     responses:
 *       200:
 *         description: Login Success
 */
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Email belum terdaftar",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        status: false,
        message: "Password salah",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1h",
      },
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
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
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
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
 *     responses:
 *       200:
 *         description: Token Refreshed Successfully
 */
app.post("/api/auth/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      status: false,
      message: "Refresh token harus diisi",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

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
      JWT_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1h",
      },
    );

    const newRefreshToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
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
 */
app.get("/api/dashboard", authMiddleware, async (req, res) => {
  try {
    const totalEmployee = await prisma.employee.count();
    const activeEmployee = await prisma.employee.count({ where: { status: "ACTIVE" } });
    const inactiveEmployee = await prisma.employee.count({ where: { status: "INACTIVE" } });

    const salaryAgg = await prisma.employee.aggregate({
      _sum: { salary: true },
      _avg: { salary: true },
    });

    const totalSalary = salaryAgg._sum.salary || 0;
    const averageSalary = Math.round(salaryAgg._avg.salary || 0);

    res.json({
      totalEmployee,
      activeEmployee,
      inactiveEmployee,
      totalSalary,
      averageSalary,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

/**
 * Master Data Endpoints
 */
app.get("/api/master/departments", authMiddleware, (req, res) => {
  res.json({
    status: true,
    data: ["IT", "Finance", "HRD", "Marketing", "Operations"],
  });
});

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
 */
app.get("/api/employees", authMiddleware, async (req, res) => {
  try {
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

    const where = {};
    if (department) where.department = department;
    if (status) {
      where.status = status.toUpperCase() === "INACTIVE" ? "INACTIVE" : "ACTIVE";
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { position: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
      ];
    }

    const totalData = await prisma.employee.count({ where });
    const totalPage = Math.ceil(totalData / limit);

    const orderByField = sort === "fullName" ? "name" : (sort === "employeeCode" ? "id" : sort);
    const employeesList = await prisma.employee.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [orderByField]: order === "desc" ? "desc" : "asc" },
    });

    const result = employeesList.map((e) => ({
      id: e.id,
      employeeCode: `EMP${String(e.id).padStart(3, "0")}`,
      fullName: e.name,
      email: e.email,
      phoneNumber: e.phone || "",
      gender: "Male",
      department: e.department,
      position: e.position,
      salary: e.salary,
      status: e.status === "ACTIVE" ? "Active" : "Inactive",
      joinDate: e.hireDate ? e.hireDate.toISOString().split("T")[0] : "",
    }));

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
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
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
 */
app.get("/api/employees/:id", authMiddleware, async (req, res) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Employee not found",
      });
    }

    res.json({
      status: true,
      data: {
        id: employee.id,
        employeeCode: `EMP${String(employee.id).padStart(3, "0")}`,
        fullName: employee.name,
        email: employee.email,
        phoneNumber: employee.phone || "",
        gender: "Male",
        department: employee.department,
        position: employee.position,
        salary: employee.salary,
        status: employee.status === "ACTIVE" ? "Active" : "Inactive",
        joinDate: employee.hireDate ? employee.hireDate.toISOString().split("T")[0] : "",
      },
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
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
 */
app.post("/api/employees", authMiddleware, async (req, res) => {
  try {
    const { fullName, email, phoneNumber, department, position, salary, status } = req.body;
    const name = fullName || req.body.name;

    if (!name || !email) {
      return res.status(400).json({
        status: false,
        message: "Validation Error",
        errors: ["fullName and email are required"],
      });
    }

    const existingEmail = await prisma.employee.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return res.status(400).json({
        status: false,
        message: "Email already exists",
      });
    }

    const newEmp = await prisma.employee.create({
      data: {
        name,
        email,
        phone: phoneNumber || "",
        department: department || "IT",
        position: position || "Staff",
        salary: Number(salary) || 0,
        status: status === "Inactive" ? "INACTIVE" : "ACTIVE",
      },
    });

    res.status(201).json({
      status: true,
      message: "Employee berhasil ditambahkan",
      data: {
        id: newEmp.id,
        employeeCode: `EMP${String(newEmp.id).padStart(3, "0")}`,
        fullName: newEmp.name,
        email: newEmp.email,
        phoneNumber: newEmp.phone,
        department: newEmp.department,
        position: newEmp.position,
        salary: newEmp.salary,
        status: newEmp.status === "ACTIVE" ? "Active" : "Inactive",
      },
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
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
 */
app.put("/api/employees/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const employee = await prisma.employee.findUnique({ where: { id } });

    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Employee not found",
      });
    }

    const { fullName, email, phoneNumber, department, position, salary, status } = req.body;

    if (email && email !== employee.email) {
      const existEmail = await prisma.employee.findUnique({ where: { email } });
      if (existEmail) {
        return res.status(400).json({
          status: false,
          message: "Email already exists",
        });
      }
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: {
        name: fullName || employee.name,
        email: email || employee.email,
        phone: phoneNumber !== undefined ? phoneNumber : employee.phone,
        department: department || employee.department,
        position: position || employee.position,
        salary: salary !== undefined ? Number(salary) : employee.salary,
        status: status ? (status === "Inactive" ? "INACTIVE" : "ACTIVE") : employee.status,
      },
    });

    res.json({
      status: true,
      message: "Employee berhasil diupdate",
      data: {
        id: updated.id,
        employeeCode: `EMP${String(updated.id).padStart(3, "0")}`,
        fullName: updated.name,
        email: updated.email,
        phoneNumber: updated.phone,
        department: updated.department,
        position: updated.position,
        salary: updated.salary,
        status: updated.status === "ACTIVE" ? "Active" : "Inactive",
      },
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
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
 */
app.delete("/api/employees/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const employee = await prisma.employee.findUnique({ where: { id } });

    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Employee not found",
      });
    }

    await prisma.employee.delete({ where: { id } });

    res.json({
      status: true,
      message: "Employee berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
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
 */
app.get("/api/leave/balance/:employeeId", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.employeeId);
    const employee = await prisma.employee.findUnique({ where: { id } });

    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Employee tidak ditemukan",
      });
    }

    const search = req.query.search || "";
    const balance = initializeLeaveBalance(employee.id, search);

    const approvedLeaves = await prisma.leave.findMany({
      where: { employeeId: id, status: "APPROVED" },
    });

    approvedLeaves.forEach((leave) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const diffTime = Math.abs(end - start);
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const typeKey = leave.leaveType.toUpperCase();
      if (balance[typeKey]) {
        balance[typeKey].used += days;
        balance[typeKey].remaining -= days;
      }
    });

    res.json({
      status: true,
      data: {
        employeeId: employee.id,
        employeeName: employee.name,
        balance,
      },
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
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
 */
app.post("/api/leave/request", authMiddleware, async (req, res) => {
  try {
    const { employeeId, type, startDate, endDate, reason } = req.body;

    if (!employeeId || !type || !startDate || !endDate || !reason) {
      return res.status(400).json({
        status: false,
        message: "Field employeeId, type, startDate, endDate, dan reason harus diisi",
      });
    }

    const empId = Number(employeeId);
    const employee = await prisma.employee.findUnique({ where: { id: empId } });

    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Employee tidak ditemukan",
      });
    }

    const newLeave = await prisma.leave.create({
      data: {
        employeeId: empId,
        leaveType: type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        status: "PENDING",
      },
      include: { employee: true },
    });

    res.status(201).json({
      status: true,
      message: "Leave request berhasil dibuat",
      data: {
        id: newLeave.id,
        employeeId: newLeave.employeeId,
        employeeName: newLeave.employee.name,
        type: newLeave.leaveType,
        startDate: newLeave.startDate.toISOString().split("T")[0],
        endDate: newLeave.endDate.toISOString().split("T")[0],
        reason: newLeave.reason,
        status: "Pending",
      },
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
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
 */
app.get("/api/leave/requests", authMiddleware, async (req, res) => {
  try {
    let { status, page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const where = {};
    if (status) {
      where.status = status.toUpperCase();
    }

    const totalData = await prisma.leave.count({ where });
    const totalPage = Math.ceil(totalData / limit);

    const leavesList = await prisma.leave.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: { employee: true },
      orderBy: { createdAt: "desc" },
    });

    const result = leavesList.map((l) => ({
      id: l.id,
      employeeId: l.employeeId,
      employeeName: l.employee?.name || "",
      type: l.leaveType,
      startDate: l.startDate.toISOString().split("T")[0],
      endDate: l.endDate.toISOString().split("T")[0],
      reason: l.reason,
      status: l.status.charAt(0) + l.status.slice(1).toLowerCase(),
      createdAt: l.createdAt,
    }));

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
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
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
 */
app.get("/api/leave/my-requests", authMiddleware, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const employeeId = Number(req.query.employeeId || 1);

    const where = { employeeId };
    if (status) {
      where.status = status.toUpperCase();
    }

    const totalData = await prisma.leave.count({ where });
    const totalPage = Math.ceil(totalData / Number(limit));

    const leavesList = await prisma.leave.findMany({
      where,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: { employee: true },
      orderBy: { createdAt: "desc" },
    });

    const result = leavesList.map((l) => ({
      id: l.id,
      employeeId: l.employeeId,
      employeeName: l.employee?.name || "",
      type: l.leaveType,
      startDate: l.startDate.toISOString().split("T")[0],
      endDate: l.endDate.toISOString().split("T")[0],
      reason: l.reason,
      status: l.status.charAt(0) + l.status.slice(1).toLowerCase(),
      createdAt: l.createdAt,
    }));

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
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
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
 */
app.put("/api/leave/:id/approve", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const leave = await prisma.leave.findUnique({ where: { id } });

    if (!leave) {
      return res.status(404).json({
        status: false,
        message: "Leave request tidak ditemukan",
      });
    }

    const updated = await prisma.leave.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
      },
    });

    res.json({
      status: true,
      message: "Leave request berhasil disetujui",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
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
 */
app.put("/api/leave/:id/reject", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const leave = await prisma.leave.findUnique({ where: { id } });

    if (!leave) {
      return res.status(404).json({
        status: false,
        message: "Leave request tidak ditemukan",
      });
    }

    const updated = await prisma.leave.update({
      where: { id },
      data: {
        status: "REJECTED",
        approvedAt: new Date(),
      },
    });

    res.json({
      status: true,
      message: "Leave request berhasil ditolak",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
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
 */
app.put("/api/leave/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const leave = await prisma.leave.findUnique({ where: { id } });

    if (!leave) {
      return res.status(404).json({
        status: false,
        message: "Leave request tidak ditemukan",
      });
    }

    const updated = await prisma.leave.update({
      where: { id },
      data: {
        status: "CANCELLED",
        approvedAt: new Date(),
      },
    });

    res.json({
      status: true,
      message: "Leave request berhasil dibatalkan",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
