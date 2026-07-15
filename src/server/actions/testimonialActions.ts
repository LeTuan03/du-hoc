"use server";

import { testimonialRepository } from "../repositories/testimonialRepository";
import { testimonialSchema } from "../validators/content.schema";
import { runDelete, runMutation, str, type ActionResult } from "./util";

function parseForm(fd: FormData) {
  return {
    studentName: str(fd, "studentName"),
    universityName: str(fd, "universityName"),
    countrySlug: str(fd, "countrySlug"),
    program: str(fd, "program"),
    content: str(fd, "content"),
    scholarship: str(fd, "scholarship"),
    year: str(fd, "year"),
  };
}

export async function createTestimonial(fd: FormData): Promise<ActionResult> {
  return runMutation(testimonialSchema, parseForm(fd), (data) =>
    testimonialRepository.create(data),
  );
}

export async function updateTestimonial(
  id: string,
  fd: FormData,
): Promise<ActionResult> {
  return runMutation(testimonialSchema, parseForm(fd), (data) =>
    testimonialRepository.update(id, data),
  );
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  return runDelete(() => testimonialRepository.delete(id));
}
