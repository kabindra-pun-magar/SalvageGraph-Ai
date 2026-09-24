import { Request, Response, NextFunction } from "express";
import {
    createProject,
    getUserProjects,
    getRecentUserProjects,
    getProjectById,
    updateProject,
    deleteProject,
} from "../services/project.service";
import { ApiError } from "../utils/api-error";
import { successResponse } from "../utils/api-response";

export const createProjectController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = res.locals.user.userId;

        const project = await createProject(
            userId,
            req.body
        );

        res.status(201).json(
            successResponse(
                "Project created successfully",
                project
            )
        );
    } catch (error) {
        next(error);
    }
};

export const getProjectsController = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = res.locals.user.userId;

        const projects = await getUserProjects(userId);

        res.status(200).json(
            successResponse(
                "Projects retrieved successfully",
                projects
            )
        );
    } catch (error) {
        next(error);
    }
};

export const getRecentProjectsController = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = res.locals.user.userId;

        const projects = await getRecentUserProjects(userId);

        res.status(200).json(
            successResponse(
                "Recent projects retrieved successfully",
                projects
            )
        );
    } catch (error) {
        next(error);
    }
};

export const getProjectController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = res.locals.user.userId;
        const projectId = req.params.id;

        if (typeof projectId !== "string" || projectId.length === 0) {
            throw new ApiError(
                400,
                "Project ID is required"
            );
        }

        const project = await getProjectById(
            projectId,
            userId
        );

        res.status(200).json(
            successResponse(
                "Project retrieved successfully",
                project
            )
        );
    } catch (error) {
        next(error);
    }
};

export const updateProjectController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = res.locals.user.userId;
        const projectId = req.params.id;

        if (typeof projectId !== "string" || projectId.length === 0) {
            throw new ApiError(
                400,
                "Project ID is required"
            );
        }

        const project = await updateProject(
            projectId,
            userId,
            req.body
        );

        res.status(200).json(
            successResponse(
                "Project updated successfully",
                project
            )
        );
    } catch (error) {
        next(error);
    }
};

export const deleteProjectController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = res.locals.user.userId;

        const projectId = req.params.id;

        if (typeof projectId !== "string" || projectId.length === 0) {
            throw new ApiError(
                400,
                "Project ID is required"
            );
        }

        await deleteProject(projectId, userId);

        res.status(200).json(
            successResponse(
                "Project deleted successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};