import * as admin from "firebase-admin";
import { config } from "./config.js";
import { readFileSync } from "fs";
import { resolve } from "path";

let app: admin.app.App | null = null;

export function getFirebase(): admin.app.App | null {
  if (app) return app;
  const path = config.FIREBASE_SERVICE_ACCOUNT_PATH;
  const projectId = config.FIREBASE_PROJECT_ID;
  if (!path || !projectId) return null;
  try {
    const abs = path.startsWith("/") ? path : resolve(process.cwd(), path);
    const cred = JSON.parse(readFileSync(abs, "utf-8"));
    app = admin.initializeApp({ credential: admin.credential.cert(cred), projectId });
    return app;
  } catch {
    return null;
  }
}

export function getFirestore(): admin.firestore.Firestore | null {
  const fb = getFirebase();
  return fb ? fb.firestore() : null;
}
