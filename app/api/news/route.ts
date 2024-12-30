export const runtime = "edge";

import { summaries } from '@/drizzle/schema';
import { neon } from '@neondatabase/serverless';
import { desc } from 'drizzle-orm';
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

export async function GET() {
    const response = await db.select().from(summaries).orderBy(desc(summaries.createdAt));
    console.log(response);
    response.forEach((row) => {

        const title = row.url.includes("reddit_news_summary_singularity") ? "Singularity" : row.url.includes("reddit_news_summary_homeautomation") ? "Home Automation" : "LocalLLaMA";

        // Calculate 2 hours before
        const twoHoursBeforeCreated = new Date(row.createdAt);
        twoHoursBeforeCreated.setHours(twoHoursBeforeCreated.getHours() - 2);

        const startTime = twoHoursBeforeCreated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const endTime = new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const completeTitle = `${title} summary from ${startTime} to ${endTime}`;
        // @ts-expect-error - title is not a column in the table
        row.title = completeTitle;
    })
    return Response.json(response)
}