import axios, { AxiosInstance } from "axios";
import type { LMSAssignment } from "../types.js";

/**
 * Base LMS Connector Interface
 */
export interface ILMSConnector {
    authenticate(credentials: { username: string; password: string }): Promise<string>;
    getAssignments(userId: string): Promise<LMSAssignment[]>;
    submitGrade(assignmentId: string, userId: string, grade: number): Promise<void>;
    getCourses(userId: string): Promise<any[]>;
    getStudents(courseId: string): Promise<any[]>;
}

/**
 * Moodle LMS Connector
 * Uses Moodle Web Services API
 */
export class MoodleConnector implements ILMSConnector {
    private baseUrl: string;
    private token: string = "";
    private client: AxiosInstance;

    constructor(instanceUrl: string) {
        this.baseUrl = instanceUrl;
        this.client = axios.create({
            baseURL: `${instanceUrl}/webservice/rest/server.php`,
            params: {
                moodlewsrestformat: "json",
            },
        });
    }

    async authenticate(credentials: { username: string; password: string }): Promise<string> {
        try {
            // Moodle token authentication
            const response = await axios.post(`${this.baseUrl}/login/token.php`, null, {
                params: {
                    username: credentials.username,
                    password: credentials.password,
                    service: "moodle_mobile_app",
                },
            });

            this.token = response.data.token;
            return this.token;
        } catch (error: any) {
            throw new Error(`Moodle authentication failed: ${error.message}`);
        }
    }

    async getAssignments(userId: string): Promise<LMSAssignment[]> {
        try {
            const response = await this.client.get("", {
                params: {
                    wstoken: this.token,
                    wsfunction: "mod_assign_get_assignments",
                },
            });

            const courses = response.data.courses || [];
            const assignments: LMSAssignment[] = [];

            for (const course of courses) {
                for (const assignment of course.assignments || []) {
                    assignments.push({
                        id: assignment.id.toString(),
                        courseId: course.id.toString(),
                        courseName: course.fullname,
                        name: assignment.name,
                        description: assignment.intro,
                        dueDate: assignment.duedate ? new Date(assignment.duedate * 1000).toISOString() : undefined,
                        maxGrade: assignment.grade || 100,
                    });
                }
            }

            return assignments;
        } catch (error: any) {
            throw new Error(`Failed to fetch assignments: ${error.message}`);
        }
    }

    async submitGrade(assignmentId: string, userId: string, grade: number): Promise<void> {
        try {
            await this.client.post("", null, {
                params: {
                    wstoken: this.token,
                    wsfunction: "mod_assign_save_grade",
                    assignmentid: assignmentId,
                    userid: userId,
                    grade: grade,
                },
            });
        } catch (error: any) {
            throw new Error(`Failed to submit grade: ${error.message}`);
        }
    }

    async getCourses(userId: string): Promise<any[]> {
        try {
            const response = await this.client.get("", {
                params: {
                    wstoken: this.token,
                    wsfunction: "core_enrol_get_users_courses",
                    userid: userId,
                },
            });

            return response.data || [];
        } catch (error: any) {
            throw new Error(`Failed to fetch courses: ${error.message}`);
        }
    }

    async getStudents(courseId: string): Promise<any[]> {
        try {
            const response = await this.client.get("", {
                params: {
                    wstoken: this.token,
                    wsfunction: "core_enrol_get_enrolled_users",
                    courseid: courseId,
                },
            });

            return response.data || [];
        } catch (error: any) {
            throw new Error(`Failed to fetch students: ${error.message}`);
        }
    }
}

/**
 * Canvas LMS Connector (Placeholder for future)
 */
export class CanvasConnector implements ILMSConnector {
    private baseUrl: string;
    private token: string = "";

    constructor(instanceUrl: string) {
        this.baseUrl = instanceUrl;
    }

    async authenticate(credentials: { username: string; password: string }): Promise<string> {
        // Canvas uses OAuth2, not username/password
        throw new Error("Canvas connector not yet implemented. Use OAuth2 flow.");
    }

    async getAssignments(userId: string): Promise<LMSAssignment[]> {
        throw new Error("Canvas connector not yet implemented");
    }

    async submitGrade(assignmentId: string, userId: string, grade: number): Promise<void> {
        throw new Error("Canvas connector not yet implemented");
    }

    async getCourses(userId: string): Promise<any[]> {
        throw new Error("Canvas connector not yet implemented");
    }

    async getStudents(courseId: string): Promise<any[]> {
        throw new Error("Canvas connector not yet implemented");
    }
}

/**
 * Factory to create LMS connector
 */
export function createLMSConnector(
    platform: "moodle" | "canvas",
    instanceUrl: string
): ILMSConnector {
    switch (platform) {
        case "moodle":
            return new MoodleConnector(instanceUrl);
        case "canvas":
            return new CanvasConnector(instanceUrl);
        default:
            throw new Error(`Unsupported LMS platform: ${platform}`);
    }
}
