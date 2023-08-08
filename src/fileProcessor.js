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
    .on("end", () => {
        results.forEach((r) => {
            const startTime = getDateObj(r.date, r.time);
            const invitees = r.invitees.split(",");
            const inv = createInvite(r.topic, startTime);
            invitees.forEach((i) => {
                sendMail(i, inv);
            });
        });
        parentPort.postMessage("processed")
    })

