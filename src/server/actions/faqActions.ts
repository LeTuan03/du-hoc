"use server";

import { faqRepository } from "../repositories/faqRepository";
import { faqSchema } from "../validators/content.schema";
import { runDelete, runMutation, str, type ActionResult } from "./util";

function parseForm(fd: FormData) {
  return {
    question: str(fd, "question"),
    answer: str(fd, "answer"),
    displayOrder: str(fd, "displayOrder"),
  };
}

export async function createFaq(fd: FormData): Promise<ActionResult> {
  return runMutation(faqSchema, parseForm(fd), (data) =>
    faqRepository.create(data),
  );
}

export async function updateFaq(
  id: string,
  fd: FormData,
): Promise<ActionResult> {
  return runMutation(faqSchema, parseForm(fd), (data) =>
    faqRepository.update(id, data),
  );
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  return runDelete(() => faqRepository.delete(id));
}
