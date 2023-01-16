import * as dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev";

import cors from "cors";
import { Prisma, PrismaClient } from "@prisma/client";
import { hash, compare } from "bcrypt";
import express from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
const prisma = new PrismaClient();

const saltRounds = 10;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.options("*", cors());

app.post("/signup", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const hashedPassword = await hash(password, saltRounds);
  try {
    await prisma.user
      .create({
        data: {
          username,
          password: hashedPassword,
          Notes: {
            // Create a new note for the user with instructions
            create: {
              title: "My first note",
              content: "This is my first note",
            },
          },
        },
      })
      .then((user) => {
        res.send("User created with username " + user.username);
      });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        console.log(
          "There is a unique constraint violation, a new user cannot be created with this username"
        );
        res.status(409).send("User already exists");
      } else {
        res.status(500).send("Error occured while creating user");
      }
    }
  }
});

app.post("/signin", async (req: Request, res: Response) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.set("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  // res.set(
  //   "Access-Control-Allow-Headers",
  //   "Content-Type, Origin, X-Requested-With, Accept"
  // );
  // res.set("Access-Control-Allow-Credentials", "true");
  // res.set("Access-Control-Max-Age", "86400");
  // res.set("Access-Control-Expose-Headers", "Set-Cookie");
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      res.status(401).send("User does not exist");
      return;
    }
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(401).send("Incorrect password");
    }
    const token = jwt.sign({ username }, JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log({ token, username });
    console.log(req.headers.origin);

    res
      .cookie("token", token, {
        secure: true,
        maxAge: 1000 * 60 * 60 * 24,
        path: "/",
      })
      .status(200)
      .send("Signed in");
  } catch (e) {
    res.status(500).send("Error occured while signing in");
  }
});

app.get("/notes", async (req: Request, res: Response) => {
  const token = req.cookies.token;
  console.log(token);
  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    const { username } = jwt.verify(token, JWT_SECRET) as {
      username: string;
    };
    if (!username) {
      res.status(401).send("Unauthorized");
      return;
    }
    const notes = await prisma.user
      .findUnique({
        where: {
          username,
        },
      })
      .Notes();
    res.send(notes);
  } catch (e) {
    res.status(401).send("Unauthorized");
  }
});

// app.get("/testing", (req: Request, res: Response) => {
//   res.set("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.set("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
//   res.set(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Origin, X-Requested-With, Accept"
//   );
//   res.set("Access-Control-Allow-Credentials", "true");
//   res.set("Access-Control-Max-Age", "86400");
//   res.set("Access-Control-Expose-Headers", "Set-Cookie");
//   res.send("Hello");
// });

app.listen(5000, () => {
  console.log("Application started on port 5000!");
});
