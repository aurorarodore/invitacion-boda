
function renderFAQs() {
    const container = document.getElementById("faq-container");

    if (!container) {
        console.error("No se encuentra #faq-container en el HTML.");
        return;
    }

    // Usar las traducciones que ya ha cargado script.js
    const faqData = translations?.faq;

    if (!faqData || !Array.isArray(faqData.faqs)) {
        console.error("No se han encontrado las FAQ en las traducciones.");
        container.textContent = "No se pudieron cargar las preguntas frecuentes.";
        return;
    }

    // Vaciar las FAQ del idioma anterior
    container.replaceChildren();

    faqData.faqs.forEach((item, index) => {
        const faqItem = document.createElement("div");
        faqItem.className = "faq-item";

        // Pregunta
        const question = document.createElement("button");
        question.className = "faq-question";
        question.type = "button";
        question.id = `faq-question-${index}`;
        question.setAttribute("aria-expanded", "false");
        question.setAttribute("aria-controls", `faq-answer-${index}`);

        const questionText = document.createElement("span");
        questionText.textContent = item.pregunta;

        const icon = document.createElement("span");
        icon.className = "faq-icon";
        icon.textContent = "+";
        icon.setAttribute("aria-hidden", "true");

        question.append(questionText, icon);

        // Respuesta
        const answer = document.createElement("div");
        answer.className = "faq-answer";
        answer.id = `faq-answer-${index}`;
        answer.setAttribute("role", "region");
        answer.setAttribute("aria-labelledby", question.id);
        answer.hidden = true;

        renderAnswer(answer, item.respuesta);

        // Acordeón: solo una pregunta abierta a la vez
        question.addEventListener("click", () => {
            const wasOpen =
                question.getAttribute("aria-expanded") === "true";

            container.querySelectorAll(".faq-question").forEach(button => {
                button.setAttribute("aria-expanded", "false");
                button.querySelector(".faq-icon").textContent = "+";

                const panel = document.getElementById(
                    button.getAttribute("aria-controls")
                );

                if (panel) {
                    panel.hidden = true;
                }
            });

            if (!wasOpen) {
                question.setAttribute("aria-expanded", "true");
                icon.textContent = "−";
                answer.hidden = false;
            }
        });

        faqItem.append(question, answer);
        container.appendChild(faqItem);
    });
}

function renderAnswer(container, text) {
    const blocks = text.split(/\n\s*\n/);

    blocks.forEach(block => {
        const trimmed = block.trim();

        if (!trimmed) return;

        const lines = trimmed.split("\n").map(line => line.trim());

        if (lines.every(line => line.startsWith("- "))) {
            const list = document.createElement("ul");

            lines.forEach(line => {
                const li = document.createElement("li");
                li.textContent = line.replace(/^- /, "");
                list.appendChild(li);
            });

            container.appendChild(list);
        } else {
            const paragraph = document.createElement("p");
            paragraph.textContent = trimmed;
            container.appendChild(paragraph);
        }
    });
}
