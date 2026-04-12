import {
  createProjectRepo,
  getProjectsByIdsRepo,
  getProjectByIdRepo,
  updateProjectRepo ,
  softDeleteProjectRepo
} from "../repositories/project.repository.js";

import {
  createProjectMemberRepo,
  getUserMembershipsRepo,
  getUserProjectMembershipRepo,
  countProjectMembersRepo
} from "../repositories/projectMember.repository.js";

export const createProjectService = async ({ name, description, userId }) => {
  // WHY: Validate input at business level
  if (!name) {
    throw new Error("Project name is required");
  }

  // Step 1: Create project
  const project = await createProjectRepo({
    name,
    description,
    createdBy: userId,
  });

  // Step 2: Add creator as admin
  await createProjectMemberRepo({
    userId,
    projectId: project._id,
    role: "admin",
  });

  return project;
};

export const getUserProjectsService = async (userId) => {
  // Step 1: Get memberships
  const memberships = await getUserMembershipsRepo(userId);

  // WHY: If no memberships → return empty
  if (!memberships.length) {
    return [];
  }

  // Step 2: Extract project IDs
  const projectIds = memberships.map((m) => m.projectId);

  // Step 3: Fetch projects
  const projects = await getProjectsByIdsRepo(projectIds);

  // Step 4: Attach member count (enhancement)
  const projectsWithCount = await Promise.all(
    projects.map(async (project) => {
      const count = await countProjectMembersRepo(project._id);

      return {
        ...project.toObject(),
        memberCount: count,
      };
    })
  );

  return projectsWithCount;
};

export const getProjectByIdService = async (projectId, userId) => {
  // Step 1: Check membership
  const membership = await getUserProjectMembershipRepo(userId, projectId);

  if (!membership) {
    throw new Error("Access denied");
  }

  // Step 2: Fetch project
  const project = await getProjectByIdRepo(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  // Step 3: Add member count
  const memberCount = await countProjectMembersRepo(projectId);

  return {
    ...project.toObject(),
    memberCount,
  };
};

export const updateProjectService = async (
  projectId,
  userId,
  updateData
) => {
  // Step 1: Check membership
  const membership = await getUserProjectMembershipRepo(userId, projectId);

  if (!membership || membership.role !== "admin") {
    throw new Error("Only admin can update project");
  }

  // Step 2: Update project
  const updatedProject = await updateProjectRepo(projectId, updateData);

  if (!updatedProject) {
    throw new Error("Project not found");
  }

  return updatedProject;
};

export const deleteProjectService = async (projectId, userId) => {
  // Step 1: Check membership
  const membership = await getUserProjectMembershipRepo(userId, projectId);

  if (!membership || membership.role !== "admin") {
    throw new Error("Only admin can delete project");
  }

  // Step 2: Soft delete
  const deletedProject = await softDeleteProjectRepo(projectId);

  if (!deletedProject) {
    throw new Error("Project not found");
  }

  return deletedProject;
};

