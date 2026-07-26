"use server";

import { programRepository } from "../repositories/programRepository";
import { standaloneProgramSchema } from "../validators/content.schema";
import {
  parseJsonArray,
  runDelete,
  runMutation,
  str,
  type ActionResult,
} from "./util";

/** CRUD ngành học đứng riêng tại /admin/programs (SRS mục 7.5) */

function parseForm(fd: FormData) {
  return {
    universitySlug: str(fd, "universitySlug"),
    name: str(fd, "name"),
    level: str(fd, "level"),
    durationMonths: str(fd, "durationMonths"),
    tuitionPerYear: str(fd, "tuitionPerYear"),
    description: str(fd, "description"),
    intakeMonths: parseJsonArray(fd.get("intakeMonths")),
    isActive: fd.get("isActive") === "on",
  };
}

export async function createProgram(fd: FormData): Promise<ActionResult> {
  return runMutation(standaloneProgramSchema, parseForm(fd), (data) =>
    programRepository.create(data.universitySlug, data),
  );
}

export async function updateProgram(
  id: string,
  fd: FormData,
): Promise<ActionResult> {
  return runMutation(standaloneProgramSchema, parseForm(fd), (data) =>
    programRepository.update(id, data.universitySlug, data),
  );
}

export async function deleteProgram(id: string): Promise<ActionResult> {
  return runDelete(() => programRepository.delete(id));
}
