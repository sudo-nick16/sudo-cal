import express from "express";
import fileUpload from "express-fileupload";
import csv from "csv-parser";
import { sendMail } from "./mailer.js";
import { bufferToStream, createInvite, getDateObj } from "./utils.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(fileUpload());

app.post("/invites", (req, res) => {
    try {
        const files = req.files?.files;
        if (files) {
            files.forEach(f => {
                const buf = f.data;
                const results = [];
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
                        console.log("processed file", f.name);
                    })
            })
            res.status(200).json({ message: "sent the invites successfully." })
        }
    } catch (error) {
        console.log("error: ", error.message)
        res.status(500).json({ error: "couldn't send invites." })
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000");
});

export default app;
