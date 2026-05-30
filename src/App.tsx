import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

const ageGroups = {
  toddler: {
    label: "Children (1–3 years old)",
    promptGuidance:
      "Focus on sensory exploration, movement, imitation, and cause-effect.",
    narrationFocus:
      "This shows sensory exploration, movement, imitation, and early cause-effect learning.",
    interpretation:
      "The child learns through body, senses, repetition, and interaction with materials.",
    educatorResponse:
      "Use simple language, mirror actions, name what happens, and support repetition."
  },
  preschool: {
    label: "Children (3–5 years old)",
    promptGuidance:
      "Focus on social interaction, communication, problem solving, symbolic thinking.",
    narrationFocus:
      "This shows collaboration, communication, and early theory-building.",
    interpretation:
      "The child constructs meaning through interaction, language, and experimentation.",
    educatorResponse:
      "Ask open-ended questions, encourage explanation, and extend thinking."
  }
};

type AgeGroup = keyof typeof ageGroups;

function extractQuotedSpeech(observation: string) {
  return Array.from(observation.matchAll(/"([^"]+)"|'([^']+)'/g))
    .map((m) => m[1] || m[2])
    .filter(Boolean);
}

function generateNarration(observation: string, ageGroup: AgeGroup) {
  const quoted = extractQuotedSpeech(observation);

  const dialogue = quoted.length
    ? `Children's spoken words: ${quoted.map((q) => `"${q}"`).join(", ")}`
    : "No direct speech recorded; meaning inferred through action, gesture, and interaction.";

  return `1. WHAT IS HAPPENING
${observation}

2. DIALOGUES
${dialogue}

3. COMPELLING INTERESTS
${ageGroups[ageGroup].narrationFocus}

4. COLLABORATION
Shared attention emerges through interaction with peers, materials, and environment.

5. PUZZLES / QUESTIONS
Moments of repetition, hesitation, surprise, and exploration indicate inquiry.

6. PEDAGOGICAL RESPONSE
${ageGroups[ageGroup].educatorResponse}

7. INTERPRETATION
${ageGroups[ageGroup].interpretation}

8. REFLECTIVE SHIFT
Documentation reveals learning as a process of relationships, experimentation, and meaning-making.`;
}

function generatePN(observation: string, ageGroup: AgeGroup) {
  return `PROFESSIONAL PEDAGOGICAL NARRATION (Reggio Emilia)

1. Observation Narrative
${observation}

2. Key Learning Focus
${ageGroups[ageGroup].narrationFocus}

3. Children's Thinking
Children are constructing meaning through interaction with materials, space, and others.

4. Collaboration
Learning emerges through shared attention, imitation, negotiation, and co-action.

5. Inquiry / Tensions
Uncertainty, repetition, and material resistance become sites of thinking.

6. Pedagogical Interpretation
${ageGroups[ageGroup].interpretation}

7. Educator Role
${ageGroups[ageGroup].educatorResponse}

8. Theoretical Lens
Reggio Emilia: hundred languages, pedagogy of listening, environment as third teacher.

9. Next Steps
Extend inquiry through revisiting materials and documenting emerging theories.`;
}

export default function App() {
  const [observation, setObservation] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("toddler");

  const [docOutput, setDocOutput] = useState("");
  const [pnOutput, setPnOutput] = useState("");

  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const recognitionRef = useRef<any>(null);
  const voiceBaseRef = useRef("");

  function getSpeechRecognition() {
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  }

  function handleVoiceInput() {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      setError("Voice input not supported.");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    voiceBaseRef.current = observation;

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }

      setObservation(
        [voiceBaseRef.current, text].filter(Boolean).join(" ")
      );
    };

    recognition.onerror = () => {
      setError("Voice input error.");
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    setError("");
    setIsRecording(true);
    recognition.start();
  }

  function handleGenerateDocumentation() {
    setDocOutput(generateNarration(observation, ageGroup));
  }

  function handleGeneratePN() {
    setPnOutput(generatePN(observation, ageGroup));
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2>ECE Observation Assistant</h2>

      <textarea
        style={{ width: "100%", height: 120 }}
        value={observation}
        onChange={(e) => setObservation(e.target.value)}
        placeholder="Write observation..."
      />

      <br /><br />

      <label>Age Group: </label>
      <select
        value={ageGroup}
        onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
      >
        <option value="toddler">1–3 years old</option>
        <option value="preschool">3–5 years old</option>
      </select>

      <br /><br />

      <button onClick={handleVoiceInput}>
        {isRecording ? "🛑 Stop Voice" : "🎤 Voice Input"}
      </button>

      <br /><br />

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={handleGenerateDocumentation}>
          Generate Documentation Notes
        </button>

        <button onClick={handleGeneratePN}>
          Generate Professional PN
        </button>
      </div>

      <hr />

      <h3>Documentation Notes</h3>
      <pre style={{ whiteSpace: "pre-wrap" }}>{docOutput}</pre>

      <h3>Professional PN</h3>
      <pre style={{ whiteSpace: "pre-wrap" }}>{pnOutput}</pre>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}