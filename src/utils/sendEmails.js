import emailjs from "emailjs-com";

/**
 * Envoie automatiquement un email hebdomadaire à chaque colocataire
 * avec le planning des tâches de la semaine.
 */
export function sendWeeklyEmails() {
  const now = new Date();
  const oneJan = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((now - oneJan) / (24 * 60 * 60 * 1000) + now.getDay() + 1) / 7);
  const lastSentWeek = localStorage.getItem("last_sent_week");

  // ⚠️ Évite d'envoyer plusieurs fois le même email la même semaine
  if (parseInt(lastSentWeek) === weekNumber) {
    console.log("✅ Email déjà envoyé cette semaine.");
    return;
  }

  // 👥 Liste des colocataires
  const roommates = ["Fleury", "Fortuné", "Joel"];
  const emails = [
    { name: "Fleury", email: "fleumobs@gmail.com" },
    { name: "Fortuné", email: "fortunemobima47@gmail.com" },
    { name: "Joel", email: "fleublackm@gmail.com" },
  ];

  // 🧹 Calcul du responsable de la semaine
  const currentResponsible = roommates[(weekNumber - 1) % roommates.length];
  const mainTask = "Gestion et suivi des tâches de la colocation";
  const siteUrl = "https://ton-site-coloc.netlify.app"; // ← remplace par TON lien Netlify

  // 📬 Envoi à chaque colocataire
  emails.forEach((person) => {
    const templateParams = {
      name: person.name,
      email: person.email,
      responsible: currentResponsible,
      task: mainTask,
      week_number: weekNumber,
      site_url: siteUrl,
    };

    emailjs
      .send(
        "fleumobs@gmail;com",       // ← ton Service ID EmailJS
        "template_tj4xtl8",        // ← ton Template ID EmailJS
        templateParams,
        "7jpXvKcBUMhTDBonN"           // ← ta clé publique EmailJS
      )
      .then(() => {
        console.log(`📬 Email envoyé à ${person.name}`);
        localStorage.setItem("last_sent_week", weekNumber);
      })
      .catch((error) => {
        console.error("❌ Erreur d'envoi :", error);
      });
  });
}
