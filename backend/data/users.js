import bcrypt from "bcryptjs";

const users = [
  {
    name: "Anushri Rawat",
    email: "anushri@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Pragati Rawat",
    email: "prags@gmail.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "John Doe",
    email: "john@gmail.com",
    password: bcrypt.hashSync("123456", 10),
  },
];
export default users;
