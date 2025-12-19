export type User = {
    id: number;
    email: string;
    name: string;
    company: string;
    category: string;
    api_key: string;
    monthly_tokens: number;
    banners: Banner[];
    prompts: Prompt[];
}

/**
 * id Int @id @default(autoincrement())
  email String @unique
  name String?
  company String?
  category String?
  api_key String
  monthly_tokens Int
  banners Banner[]
  prompts Prompt[]
 */

export type Banner = {
    id: number;
    title: string;
    description?: string;
    link: string;
    author: User;
    prompt: Prompt;
    created_at: Date;
    
}

/**
 * model Banner {
  id Int @id 
  title String
  description String?
  link String
  author User @relation(fields: [authorId], references: [id])
  authorId Int
  prompt Prompt @relation(fields: [promptId], references: [id])
  promptId Int
  created_at DateTime @default(now())
}
 */

export type Prompt = {
    id: number;
    title?: string;
    description?: string;
    color_pallete?: string;
    theme?: string;
    eg_images: string[];
    author : User;
    banners: Banner[];
}

/**
 * model Prompt {
  id Int @id
  title String?
  description String?
  color_pallete String?
  theme String?
  eg_images String[]
  author User @relation(fields: [authorId], references: [id])
  authorId Int
  banners Banner[]
}
 */