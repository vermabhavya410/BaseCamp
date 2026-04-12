import {
  createProjectService,
  getUserProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
} from "../services/project.service.js";

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    // WHY: Pass clean data to service
    const project = await createProjectService({
      name,
      description,
      userId: req.user._id, // from verifyJwt
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserProjects = async (req, res) => {
  try {
    const projects = await getUserProjectsService(req.user._id);

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await getProjectByIdService(
      projectId,
      req.user._id
    );

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const updatedProject = await updateProjectService(
      projectId,
      req.user._id,
      req.body // WHY: update fields
    );

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const deletedProject = await deleteProjectService(
      projectId,
      req.user._id
    );

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: deletedProject,
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

