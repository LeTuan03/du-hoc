"use server";

import { scholarshipRepository } from "../repositories/scholarshipRepository";
import { scholarshipSchema } from "../validators/content.schema";
import { slugify } from "@/lib/slugify";
import {
  runDelete,
  runMutation,
  splitLines,
  str,
  type ActionResult,
} from "./util";

function parseForm(fd: FormData) {
  const name = str(fd, "name");
  return {
    name,
    slug: str(fd, "slug").trim() || slugify(name),
    universitySlug: str(fd, "universitySlug"),
    countrySlug: str(fd, "countrySlug"),
    value: str(fd, "value"),
    conditions: splitLines(fd.get("conditions")),
    deadline: str(fd, "deadline"),
    description: str(fd, "description"),
    isActive: fd.get("isActive") === "on",
  };
}

export async function createScholarship(fd: FormData): Promise<ActionResult> {
  return runMutation(scholarshipSchema, parseForm(fd), (data) =>
    scholarshipRepository.create(data),
  );
}

export async function updateScholarship(
  id: string,
  fd: FormData,
): Promise<ActionResult> {
  return runMutation(scholarshipSchema, parseForm(fd), (data) =>
    scholarshipRepository.update(id, data),
  );
}

export async function deleteScholarship(id: string): Promise<ActionResult> {
  return runDelete(() => scholarshipRepository.delete(id));
}
