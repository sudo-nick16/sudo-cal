import express from "express";
import { Worker } from "worker_threads";
import fileUpload from "express-fileupload";

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(fileUpload());

export function processCsvFile(file) {
    const worker = new Worker("./src/fileProcessor.js", {
        workerData: {
            buffer: file.data,
        }
    })
    worker.once("message", () => {
        console.log(file.name, "processed.");
    })
    worker.once("error", (e) => {
        throw new Error(e.message);
    })
}

app.post("/invites", async (req, res) => {
    try {
        const files = req.files?.files;
        if (files) {
            files.forEach(async (f) => {
                processCsvFile(f);
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
