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
      "Adapt the pedagogical documentation for children 1-3 years old. Focus on sensory exploration, movement, imitation, and basic cause-effect. Use simpler language.",
    narrationFocus:
      "This observation shows sensory exploration, movement, imitation, and early cause-and-effect learning.",
    interpretation:
      "The child is using their body and senses to learn what happens when they touch, move, repeat, and copy actions.",
    educatorResponse:
      "An educator could offer simple words, repeat the child's actions, name what is happening, and provide safe materials that invite touching, moving, filling, dumping, stacking, or making sounds."
  },
  preschool: {
    label: "Children (3–5 years old)",
    promptGuidance:
      "Adapt the pedagogical documentation for children 3-5 years old. Include social interaction, more complex thinking, early problem solving, and communication.",
    narrationFocus:
      "This observation shows growing social interaction, communication, problem solving, and more complex thinking.",
    interpretation:
      "The child is making connections, testing ideas, communicating meaning, and beginning to solve problems through play and interaction.",
    educatorResponse:
      "An educator could ask open-ended questions, invite children to explain their thinking, encourage turn-taking or collaboration, and extend the play with materials that support planning, comparing, predicting, or storytelling."
  }
};

type AgeGroup = keyof typeof ageGroups;

const documentationGuidance = {
  toddler: {
    complexity:
      "Use clear, grounded language for children 1-3. Attend closely to sensory exploration, movement, imitation, rhythm, repetition, and basic cause-effect.",
    compelling:
      "The compelling thread appears in the child's sensory and movement-based investigation: touching, repeating, shifting, watching, imitating, and noticing what the body and materials can do together.",
    collaboration:
      "Collaboration may be quiet and bodily at this age. Shared attention, parallel play, watching another child, copying a gesture, or responding to an educator's simple words can all show an emerging collective inquiry.",
    response:
      "Sustain the inquiry by offering fewer materials with stronger sensory contrast, leaving time for repetition, mirroring the child's actions, and using short language such as, \"You pushed it,\" \"It fell,\" \"Again?\" or \"What do you notice?\"",
    interpretation:
      "From a Reggio Emilia lens, the young child is an active researcher using the body, senses, and repetition as languages for thinking. Meaning is made through contact with materials, movement through space, and responsive relationships."
  },
  preschool: {
    complexity:
      "Use more developed language for children 3-5. Attend to social interaction, symbolic thinking, communication, early problem solving, negotiation, planning, and theory-building.",
    compelling:
      "The compelling thread appears in the children's attempts to connect ideas, test possibilities, communicate plans, revisit theories, and use materials to make thinking visible.",
    collaboration:
      "Collaboration may appear through shared focus, peer conversation, turn-taking, disagreement, imitation with variation, joint planning, or children building on one another's ideas.",
    response:
      "Sustain the inquiry by adding open-ended provocations, repositioning materials to invite comparison or collaboration, documenting children's words, and using language such as, \"What is your theory?\" \"How could we test that?\" or \"What do you notice about your friend's idea?\"",
    interpretation:
      "From a Reggio Emilia lens, the child is a capable meaning-maker who uses relationships, materials, language, and representation to construct theories about the world. Learning is visible in experimentation, negotiation, revision, and shared inquiry."
  }
};

function extractQuotedSpeech(observation: string) {
  return Array.from(observation.matchAll(/"([^"]+)"|'([^']+)'/g))
    .map((match) => match[1] || match[2])
    .filter(Boolean);
}

function buildPrompt(observation: string, ageGroup: AgeGroup) {
  const group = ageGroups[ageGroup];
  const guidance = documentationGuidance[ageGroup];

  return [
    "Create pedagogical documentation grounded in Reggio Emilia practice.",
    `Age group: ${group.label}.`,
    guidance.complexity,
    "Follow this exact nine-section structure: WHAT IS HAPPENING, DIALOGUES, WHAT SEEMS TO BE COMPELLING AND FASCINATING, COLLABORATIONS AND INTERSECTIONS, PUZZLEMENTS / PROBLEMS / KNOTS, PEDAGOGICAL RESPONSE, PEDAGOGICAL INTERPRETATION, THEORETICAL CONNECTIONS, REFLECTIVE SHIFT.",
    "Write visually, narratively, and descriptively. Emphasize child agency. Treat materials as active participants. Avoid bullet-point simplification in early sections.",
    "Do not solve problems for children. Suggest provocations, material or environment modifications, and teacher language strategies.",
    `Observation: ${observation.trim()}`
  ].join("\n");
}

function generateNarration(observation: string, ageGroup: AgeGroup) {
  const cleanObservation = observation.trim();
  const guidance = documentationGuidance[ageGroup];
  const quotedSpeech = extractQuotedSpeech(cleanObservation);
  const dialogueText = quotedSpeech.length
    ? `The recorded spoken words include: ${quotedSpeech
        .map((quote) => `"${quote}"`)
        .join(", ")}. These words can be held alongside the educator's responses and the quieter dialogue between the child, the materials, and the environment.`
    : "No exact spoken words were recorded in the observation. The dialogue is therefore read through gesture, timing, gaze, movement, educator presence, and the way the materials responded to the child's actions.";

  return `1. WHAT IS HAPPENING (Observation)
${cleanObservation}

The observation is held as a visual narrative of action in context: the child or children move through the space, meet the available materials, and leave traces of attention through gesture, touch, sound, placement, repetition, and pause. The description stays close to what can be seen and heard: bodies reaching, hands testing, eyes following, materials shifting, surfaces responding, and the environment becoming part of the encounter.

---

2. DIALOGUES (Children / Educator / Materials interaction)
${dialogueText}

The materials are not passive props in this documentation. They answer through weight, texture, sound, resistance, movement, balance, and change. The educator's role is to listen to these exchanges, respond without taking over, and offer language that makes children's intentions, pauses, and discoveries available for further inquiry.

---

3. WHAT SEEMS TO BE COMPELLING AND FASCINATING
${guidance.compelling} The interest is not treated as a finished outcome, but as an unfolding question: what keeps drawing the child back, what action asks to be repeated, what material response invites another attempt, and what small surprise seems to hold attention?

---

4. COLLABORATIONS AND INTERSECTIONS
${guidance.collaboration} The shared focus may be visible in children gathering around the same material, noticing one another's actions, borrowing strategies, responding to sounds or movement, or returning to a common problem from different directions. These intersections suggest an inquiry beginning to live between people, materials, and place.

---

5. PUZZLEMENTS / PROBLEMS / KNOTS
The important tensions are the moments where the child pauses, repeats, changes approach, watches closely, or encounters resistance from the material or environment. A knot may appear when something does not move as expected, when another child enters the play, when the material changes shape or position, or when the child seems to wonder, "What happens if I try this again, differently?"

---

6. PEDAGOGICAL RESPONSE (How to sustain inquiry)
${guidance.response} The educator can stay near the inquiry by observing before intervening, offering time, naming visible strategies, and preparing the environment so the question can continue. The aim is not to fix the problem for the child, but to keep the conditions alive for investigation.

---

7. PEDAGOGICAL INTERPRETATION (Reggio Emilia lens)
${guidance.interpretation} The documentation points toward child agency: the child is not simply completing an activity, but forming relationships with materials, testing possibilities, and communicating thought through many languages.

---

8. THEORETICAL CONNECTIONS
This documentation connects with Reggio Emilia principles of the competent child, the hundred languages, the environment as the third teacher, and progettazione: curriculum emerging through careful listening and responsive planning. Malaguzzi's image of children as rich in potential is useful here when the educator reads action, gesture, material choice, and repetition as forms of thinking rather than as small or incidental behavior.

---

9. REFLECTIVE SHIFT (Educator thinking)
This documentation invites the educator to look again at ordinary moments as research. Instead of asking only what skill was demonstrated, the educator can ask what relationship, theory, uncertainty, or possibility became visible through the child's encounter with people, materials, and the environment.`;
}

export default function App() {
  const [observation, setObservation] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("toddler");
  const [narration, setNarration] = useState("");
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const voiceBaseRef = useRef("");

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function getSpeechRecognition() {
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  }

  function handleVoiceInput() {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      setError("Voice input is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    voiceBaseRef.current = observation.trim();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let spokenText = "";

      for (let index = 0; index < event.results.length; index += 1) {
        spokenText += event.results[index][0].transcript;
      }

      setObservation(
        [voiceBaseRef.current, spokenText.trim()].filter(Boolean).join(" ")
      );
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setError("Voice input stopped. Please try again.");
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    setError("");
    setIsRecording(true);
    recognition.start();
  }

  function handleGenerate() {
    if (!observation.trim()) {
      setNarration("");
      setError("Please enter an observation first.");
      return;
    }

    const aiPrompt = buildPrompt(observation, ageGroup);
    console.info("ECE Observation Assistant prompt:", aiPrompt);
    setError("");
    setNarration(generateNarration(observation, ageGroup));
  }

  return (
    <main className="app-shell">
      <section className="workspace" aria-labelledby="app-title">
        <div className="heading">
          <p className="eyebrow">ECE Observation Assistant</p>
          <h1 id="app-title">Pedagogical Documentation</h1>
        </div>

        <div className="input-area">
          <label htmlFor="age-group">Age group</label>
          <select
            id="age-group"
            value={ageGroup}
            onChange={(event) => setAgeGroup(event.target.value as AgeGroup)}
          >
            <option value="toddler">{ageGroups.toddler.label}</option>
            <option value="preschool">{ageGroups.preschool.label}</option>
          </select>

          <div className="observation-header">
            <label htmlFor="observation">Observation notes</label>
            <button
              className={`voice-button ${isRecording ? "recording" : ""}`}
              type="button"
              onClick={handleVoiceInput}
            >
              {isRecording ? "🛑 Stop Recording" : "🎤 Start Voice Input"}
            </button>
          </div>
          <textarea
            id="observation"
            value={observation}
            onChange={(event) => setObservation(event.target.value)}
            placeholder="Describe what you noticed the child doing, saying, exploring, or trying."
            rows={8}
          />

          {error ? <p className="error">{error}</p> : null}

          <button type="button" onClick={handleGenerate}>
            Generate Documentation Notes
          </button>
        </div>

        <section className="output-area" aria-labelledby="output-title">
          <h2 id="output-title">Documentation Notes</h2>
          <div className="output-box">
            {narration ? (
              <p>{narration}</p>
            ) : (
              <p className="placeholder">
                Your pedagogical documentation notes will appear here.
              </p>
            )}
          </div>
        </section>

      </section>
    </main>
  );
}
