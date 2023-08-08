import { workerData, parentPort } from "worker_threads"
import csv from "csv-parser";
import { sendMail } from "./mailer.js";
import { bufferToStream, createInvite, getDateObj } from "./utils.js";

const buf = workerData.buffer
const results = [];

if (!buf) {
    throw new Error("invalid buffer.")
}

bufferToStream(buf)
    .pipe(csv())
    .on("data", (data) => {
        results.push(data);
    })
    .on("end", async () => {
        await Promise.all(results.map(async (r) => {
            return new Promise(async (res, _) => {
                const startTime = getDateObj(r.date, r.time);
                const invitees = r.invitees.split(",");
                const inv = createInvite(r.topic, startTime);
                await Promise.all(invitees.map((i) => sendMail(i, inv)))
                res();
            })
        }));
        parentPort.postMessage("processed")
    })

