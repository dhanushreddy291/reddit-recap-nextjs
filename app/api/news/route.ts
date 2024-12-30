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

        // IST timezone is 5:30 hours ahead of UTC
        twoHoursBeforeCreated.setHours(twoHoursBeforeCreated.getHours() + 3);
        twoHoursBeforeCreated.setMinutes(twoHoursBeforeCreated.getMinutes() + 30);

        const startTime = twoHoursBeforeCreated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let endTime = new Date(row.createdAt);
        endTime.setHours(endTime.getHours() + 5);
        endTime.setMinutes(endTime.getMinutes() + 30);
        const endTimeAsString = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // 9 May
        let time = new Date(row.createdAt);
        time.setHours(time.getHours() + 5);
        time.setMinutes(time.getMinutes() + 30);

        let onTheDay = time.toLocaleTimeString([], { month: 'short', day: 'numeric' });
        onTheDay = onTheDay.split(",")[0]

        const completeTitle = `${title} summary from ${startTime} to ${endTimeAsString} on ${onTheDay}`;
        // @ts-expect-error - title is not a column in the table
        row.title = completeTitle;
    })
    return Response.json(response)
}