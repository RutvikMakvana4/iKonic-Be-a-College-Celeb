import Admin from "../model/admin";

const data = [
  {
    email: "admin@mailinator.com",
    password: "$2a$12$nzBDN7GMldpS7HKJ.nMzAeoyC12003O97m.R524n68zLn2SwWKB5.", //admin@123
  },
];

async function adminLoginData() {
  try {
    const findAdmin = await Admin.findOne({ email: data[0].email });
    if (!findAdmin) {
      await Admin.insertMany(data);
    }
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

adminLoginData();
