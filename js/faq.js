
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("faq-container");

  try {
    // Detect the website language
    // Supports <html lang="en">, <html lang="es"> and <html lang="nl">
    const language = document.documentElement.lang
      .toLowerCase()
      .split("-")[0];

    const supportedLanguages = ["en", "es", "nl"];
    const selectedLanguage = supportedLanguages.includes(language)
      ? language
      : "en";

    // Load the corresponding translation file
    const response = await fetch(`i18n/${selectedLanguage}.json`);

    if (!response.ok) {
      throw new Error(`Could not load ${selectedLanguage}.json`);
    }

    const data = await response.json();

    //  JSON structure is: { "faqs": [...] }
    data.faq.faqs.forEach((item, index) => {
      const faqItem = document.createElement("div");
      faqItem.className = "faq-item";

      // Question button
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

      // Answer panel
      const answer = document.createElement("div");
      answer.className = "faq-answer";
      answer.id = `faq-answer-${index}`;
      answer.setAttribute("role", "region");
      answer.setAttribute("aria-labelledby", question.id);
      answer.hidden = true;

      renderAnswer(answer, item.respuesta);

      // Accordion behaviour: only one open at a time
      question.addEventListener("click", () => {
        const wasOpen =
          question.getAttribute("aria-expanded") === "true";

        // Close all questions
        container.querySelectorAll(".faq-question").forEach((button) => {
          button.setAttribute("aria-expanded", "false");

          const buttonIcon = button.querySelector(".faq-icon");
          buttonIcon.textContent = "+";

          const panel = document.getElementById(
            button.getAttribute("aria-controls")
          );

          panel.hidden = true;
        });

        // Open the clicked question if it was closed
        if (!wasOpen) {
          question.setAttribute("aria-expanded", "true");
          icon.textContent = "−";
          answer.hidden = false;
        }
      });

      faqItem.append(question, answer);
      container.appendChild(faqItem);
    });
  } catch (error) {
    console.error("Error loading FAQs:", error);
    container.textContent =
      "Sorry, the FAQs could not be loaded.";
  }
});

function renderAnswer(container, text) {
  // Split paragraphs separated by blank lines
  const blocks = text.split(/\n\s*\n/);

  blocks.forEach((block) => {
    const trimmed = block.trim();

    if (!trimmed) return;

    const lines = trimmed.split("\n").map((line) => line.trim());

    // Render bullet lists
    if (lines.every((line) => line.startsWith("- "))) {
      const list = document.createElement("ul");

      lines.forEach((line) => {
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