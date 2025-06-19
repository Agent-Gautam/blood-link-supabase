"use server"

import { randomUUID } from 'crypto';

export default async function generateUUID(): Promise<string> {
    return randomUUID();
}