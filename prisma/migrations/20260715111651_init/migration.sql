-- CreateTable
CREATE TABLE "countries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "highlights" TEXT[],
    "universityCount" INTEGER NOT NULL,
    "avgTuition" TEXT NOT NULL,
    "workRights" TEXT NOT NULL,
    "visaRate" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "universities" (
    "id" TEXT NOT NULL,
    "countrySlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "ranking" INTEGER,
    "rankingSource" TEXT NOT NULL,
    "tuitionMin" INTEGER NOT NULL,
    "tuitionMax" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "admissionRequirements" TEXT[],
    "englishRequirements" TEXT NOT NULL,
    "livingCost" TEXT NOT NULL,
    "dormitoryInfo" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "majors" TEXT[],
    "programs" JSONB NOT NULL DEFAULT '[]',
    "faqs" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholarships" (
    "id" TEXT NOT NULL,
    "universitySlug" TEXT,
    "countrySlug" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "conditions" TEXT[],
    "deadline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scholarships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publishedAt" TEXT NOT NULL,
    "readMinutes" INTEGER NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "coverImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "countrySlug" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "scholarship" TEXT,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "currentSchool" TEXT,
    "gpa" DOUBLE PRECISION,
    "languageLevel" TEXT,
    "desiredCountry" TEXT,
    "desiredUniversity" TEXT,
    "major" TEXT,
    "intakeTerm" TEXT,
    "budget" TEXT,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "sourcePage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_notes" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "statusChangeTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_slug_key" ON "countries"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "universities_slug_key" ON "universities"("slug");

-- CreateIndex
CREATE INDEX "universities_countrySlug_idx" ON "universities"("countrySlug");

-- CreateIndex
CREATE UNIQUE INDEX "scholarships_slug_key" ON "scholarships"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_category_idx" ON "articles"("category");

-- CreateIndex
CREATE INDEX "leads_email_idx" ON "leads"("email");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "lead_notes_leadId_idx" ON "lead_notes"("leadId");

-- AddForeignKey
ALTER TABLE "lead_notes" ADD CONSTRAINT "lead_notes_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
