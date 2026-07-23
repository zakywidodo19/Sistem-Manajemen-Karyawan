const employees = [];

const departments = ["IT", "Finance", "HRD", "Marketing", "Operations"];

const positions = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "QA Engineer",
  "UI/UX Designer",
  "DevOps Engineer",
  "Finance Staff",
  "HR Staff",
  "Marketing Specialist",
];

const cities = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Semarang"];

const provinces = [
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Timur",
  "DI Yogyakarta",
  "Jawa Tengah",
];

for (let i = 1; i <= 100; i++) {
  const gender = i % 2 === 0 ? "Male" : "Female";

  employees.push({
    id: i,
    employeeCode: `EMP${String(i).padStart(3, "0")}`,

    fullName: `${gender === "Male" ? "Budi" : "Siti"} ${i}`,

    email: `employee${i}@company.com`,

    phoneNumber: `08${Math.floor(1000000000 + Math.random() * 9000000000)}`,

    gender,

    birthDate: `199${i % 10}-0${(i % 9) + 1}-15`,

    address: {
      street: `Jl. Mawar No. ${i}`,
      city: cities[i % cities.length],
      province: provinces[i % provinces.length],
      postalCode: `${10000 + i}`,
    },

    department: departments[i % departments.length],

    position: positions[i % positions.length],

    joinDate: `202${i % 5}-0${(i % 9) + 1}-10`,

    salary: 5000000 + Math.floor(Math.random() * 10000000),

    status: i % 4 === 0 ? "Inactive" : "Active",

    emergencyContact: {
      name: `Emergency Contact ${i}`,
      relationship: "Parent",
      phoneNumber: `08${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    },
  });
}

module.exports = employees;
