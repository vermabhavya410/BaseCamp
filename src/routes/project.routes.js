import { Router } from "express";
import { verifyJwt } from "../middlewares/verifyJwt.js";

import {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

const Projectroute = Router();

// Create project
Projectroute.post("/", verifyJwt, createProject);

// Get all projects of logged-in user
Projectroute.get("/", verifyJwt, getUserProjects);

// Get single project
Projectroute.get("/:projectId", verifyJwt, getProjectById);

// Update project (admin only - checked in service)
Projectroute.put("/:projectId", verifyJwt, updateProject);

// Delete project (soft delete - admin only)
Projectroute.delete("/:projectId", verifyJwt, deleteProject);

export default Projectroute;