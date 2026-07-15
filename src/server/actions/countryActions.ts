"use server";

import { countryRepository } from "../repositories/countryRepository";
import { countrySchema } from "../validators/content.schema";
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
    description: str(fd, "description"),
    highlights: splitLines(fd.get("highlights")),
    universityCount: str(fd, "universityCount"),
    avgTuition: str(fd, "avgTuition"),
    workRights: str(fd, "workRights"),
    visaRate: str(fd, "visaRate"),
    displayOrder: str(fd, "displayOrder"),
  };
}

export async function createCountry(fd: FormData): Promise<ActionResult> {
  return runMutation(countrySchema, parseForm(fd), (data) =>
    countryRepository.create(data),
  );
}

export async function updateCountry(
  id: string,
  fd: FormData,
): Promise<ActionResult> {
  return runMutation(countrySchema, parseForm(fd), (data) =>
    countryRepository.update(id, data),
  );
}

export async function deleteCountry(id: string): Promise<ActionResult> {
  return runDelete(() => countryRepository.delete(id));
}
