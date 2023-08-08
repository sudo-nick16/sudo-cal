const fileContainer = document.getElementById("file");
const container = document.getElementById("container");
const notif = document.getElementById("notif");
const submit = document.getElementById("submit");

const notify = (message, err) => {
    notif.innerText = message;
    if (err) {
        notif.classList.remove("bg-green-500");
        notif.classList.add("bg-red-500");
    } else {
        notif.classList.add("bg-green-500");
        notif.classList.remove("bg-red-500");
    }
    notif.classList.toggle("opacity-0");
    setTimeout(() => {
        notif.classList.toggle("opacity-0");
        notif.classList.remove("bg-red-500");
        notif.classList.add("bg-green-500");
    }, 1000)
};

fileContainer.addEventListener("change", (event) => {
    console.log(event.target.files)
    if (event.target.files.length === 0) {
        notify("No files found.", true)
        return;
    }
    if (event.target.files.length > 1) {
        if (!confirm("You sure you wish to upload multiple files?")) {
            return;
        }
    }
    const fileList = [];
    for (let i = 0; i < event.target.files.length; ++i) {
        fileList.push(event.target.files[i])
    }
    notify(`added "${fileList.map(f => f.name).join(",")}"`)
});

submit.addEventListener("click", async (event) => {
    event.preventDefault();
    console.log(fileContainer.files)
    if (fileContainer.files?.length === 0) {
        notify("Please select a file", true);
        return;
    }
    const formData = new FormData();
    for (let i = 0; i < fileContainer.files.length; ++i) {
        formData.append("files", fileContainer.files[i]);
    }
    console.log("submit");
    try {
        const res = await fetch("/invites", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        if (data.error) {
            notify(data.error, true);
        } else {
            notify(data.message);
        }
    } catch (e) {
        notify("Failed to send invites.", true);
        console.log("error: ", e.message);
    }
});
