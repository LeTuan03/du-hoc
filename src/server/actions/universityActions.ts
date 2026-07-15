"use server";

import { universityRepository } from "../repositories/universityRepository";
import { universitySchema } from "../validators/content.schema";
import { slugify } from "@/lib/slugify";
import {
  parseJsonArray,
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
    countrySlug: str(fd, "countrySlug"),
    city: str(fd, "city"),
    ranking: str(fd, "ranking").trim(),
    rankingSource: str(fd, "rankingSource"),
    tuitionMin: str(fd, "tuitionMin"),
    tuitionMax: str(fd, "tuitionMax"),
    description: str(fd, "description"),
    admissionRequirements: splitLines(fd.get("admissionRequirements")),
    englishRequirements: str(fd, "englishRequirements"),
    livingCost: str(fd, "livingCost"),
    dormitoryInfo: str(fd, "dormitoryInfo"),
    isFeatured: fd.get("isFeatured") === "on",
    majors: splitLines(fd.get("majors")),
    programs: parseJsonArray(fd.get("programs")),
    faqs: parseJsonArray(fd.get("faqs")),
  };
}

export async function createUniversity(fd: FormData): Promise<ActionResult> {
  return runMutation(universitySchema, parseForm(fd), (data) =>
    universityRepository.create(data),
  );
}

export async function updateUniversity(
  id: string,
  fd: FormData,
): Promise<ActionResult> {
  return runMutation(universitySchema, parseForm(fd), (data) =>
    universityRepository.update(id, data),
  );
}

export async function deleteUniversity(id: string): Promise<ActionResult> {
  return runDelete(() => universityRepository.delete(id));
}
