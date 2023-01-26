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

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.options("*", cors());

// add return in gates

app.get("/ping", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "pong" });
});

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
            create: {
              title: "Welcome to appNote!",
              content:
                "This is your first note. You can edit it by clicking on the note.",
            },
          },
        },
      })
      .then((user) => {
        res.status(200).json({
          success: true,
          message: "Username created with username " + user.username,
        });
      });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        console.log(
          "There is a unique constraint violation, a new user cannot be created with this username"
        );
        res
          .status(409)
          .json({ success: false, message: "Username already exists" });
      } else {
        res
          .status(500)
          .json({ sucess: false, message: "Error occured while signing up" });
      }
    }
  }
});

app.post("/signin", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Username or password is incorrect",
      });
      return;
    }
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(401).json({
        success: false,
        message: "Username or password is incorrect",
      });
      return;
    }
    const token = jwt.sign({ username }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .cookie("token", token, {
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: "/",
      })
      .status(200)
      .json({ success: true, message: "Signed in" });
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "Error occured while signing in" });
  }
});

app.get("/getnotes", async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  try {
    const { username } = jwt.verify(token, JWT_SECRET) as {
      username: string;
    };
    if (!username) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const notes = await prisma.user
      .findUnique({
        where: {
          username,
        },
      })
      .Notes();
    res.status(200).json({
      success: true,
      notes: notes!
        .sort((a, b) => {
          if (a.id < b.id) return -1;
          if (a.id > b.id) return 1;
          return 0;
        })
        .reverse(),
    });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/createnote", async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  try {
    const { username } = jwt.verify(token, JWT_SECRET) as {
      username: string;
    };
    if (!username) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    await prisma.notes.create({
      data: {
        username: username,
        title: "",
        content: "",
      },
    });
    res.status(200).json({ success: true, message: "Note created" });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/deletenote", async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  if (!req.body.id) {
    res.status(400).json({ success: false, message: "Bad request" });
    return;
  }
  try {
    const { username } = jwt.verify(token, JWT_SECRET) as {
      username: string;
    };
    if (!username) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    await prisma.notes.delete({
      where: {
        username_id: {
          username: username,
          id: req.body.id,
        },
      },
    });
    res.status(200).json({ success: true, message: "Note deleted" });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/updatenote", async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  if (!req.body.id) {
    res.status(400).json({ success: false, message: "Bad request" });
    return;
  }
  try {
    const { username } = jwt.verify(token, JWT_SECRET) as {
      username: string;
    };
    if (!username) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    await prisma.notes.update({
      where: {
        username_id: {
          username: username,
          id: req.body.id,
        },
      },
      data: {
        title: req.body.title,
        content: req.body.content,
      },
    });
    res.status(200).json({ success: true, message: "Note updated" });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.listen(5000, () => {
  console.log("Application started on port 5000!");
});
