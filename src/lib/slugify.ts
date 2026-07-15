/** Sinh slug chuẩn SEO từ tiêu đề tiếng Việt (bỏ dấu, đ→d, kebab-case) */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
