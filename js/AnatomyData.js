export const ANATOMY_DATA = {
  heart: {
    left_ventricle: {
      name: "Left Ventricle",
      description: "The main pumping chamber. Sends oxygenated blood out to the entire body through the aorta."
    },
    right_ventricle: {
      name: "Right Ventricle",
      description: "Pumps deoxygenated blood from the heart to the lungs to pick up oxygen."
    },
    left_atrium: {
      name: "Left Atrium",
      description: "Receives oxygen-rich blood returning from the lungs via the pulmonary veins."
    },
    right_atrium: {
      name: "Right Atrium",
      description: "Receives oxygen-depleted blood from the body through the superior and inferior vena cava."
    },
    aorta: {
      name: "Aorta",
      description: "The largest artery in the body. Carries oxygenated blood from the left ventricle to the rest of the body."
    },
    pulmonary_artery: {
      name: "Pulmonary Artery",
      description: "Carries deoxygenated blood from the right ventricle to the lungs. Unique - an artery carrying deoxygenated blood."
    },
    mitral_valve: {
      name: "Mitral Valve",
      description: "Controls blood flow between the left atrium and left ventricle. Has two leaflets."
    },
    tricuspid_valve: {
      name: "Tricuspid Valve",
      description: "Controls blood flow between the right atrium and right ventricle. Has three leaflets."
    },
    coronary_artery: {
      name: "Coronary Artery",
      description: "Supplies blood to the heart muscle itself. Blockage here causes a heart attack."
    }
  },
  lungs: {
    left_lung: {
      name: "Left Lung",
      description: "Has two lobes and sits slightly smaller to make room for the heart.",
      whyItMatters: "Each breath fills this lung with oxygen-rich air that will pass into the bloodstream."
    },
    right_lung: {
      name: "Right Lung",
      description: "Has three lobes and is usually a little larger than the left lung.",
      whyItMatters: "Its larger volume helps maximize how much oxygen you can take in with each breath."
    },
    trachea: {
      name: "Trachea",
      description: "The windpipe, a sturdy tube that carries air from the throat down into the chest.",
      whyItMatters: "Its cartilage rings stop the airway from collapsing while you breathe."
    },
    bronchi: {
      name: "Bronchi",
      description: "Two main branches that split from the trachea, one entering each lung before dividing again.",
      whyItMatters: "They act like the main roadways that distribute air to smaller and smaller passages."
    },
    diaphragm: {
      name: "Diaphragm",
      description: "The dome-shaped muscle below the lungs that moves downward when you inhale.",
      whyItMatters: "It is the main muscle of breathing and creates the suction that pulls air into the lungs."
    },
    pleura: {
      name: "Pleura",
      description: "A thin, double-layered membrane that wraps the lungs and lines the chest wall.",
      whyItMatters: "Its lubricated layers let the lungs glide smoothly as the chest expands and contracts."
    },
    alveoli: {
      name: "Alveoli",
      description: "Tiny air sacs at the ends of the smallest airways where gases are exchanged.",
      whyItMatters: "This is where oxygen enters the blood and carbon dioxide leaves the body."
    }
  },
  brain: {
    cerebrum: {
      name: "Cerebrum",
      description: "The largest brain region. Controls thought, memory, language, and voluntary movement."
    },
    cerebellum: {
      name: "Cerebellum",
      description: "The little brain at the back. Controls balance, coordination, and fine motor skills."
    },
    brain_stem: {
      name: "Brain Stem",
      description: "Controls vital automatic functions - breathing, heart rate, blood pressure, and sleep cycles."
    },
    frontal_lobe: {
      name: "Frontal Lobe",
      description: "Controls personality, decision-making, planning, and voluntary movement."
    },
    temporal_lobe: {
      name: "Temporal Lobe",
      description: "Processes sound and language. Also plays a key role in memory formation."
    },
    parietal_lobe: {
      name: "Parietal Lobe",
      description: "Processes sensory information - touch, temperature, pain, and spatial awareness."
    },
    occipital_lobe: {
      name: "Occipital Lobe",
      description: "The visual processing center. Interprets everything we see."
    },
    corpus_callosum: {
      name: "Corpus Callosum",
      description: "Bundle of nerve fibers connecting the left and right hemispheres of the brain."
    },
    hippocampus: {
      name: "Hippocampus",
      description: "Critical for forming new memories and spatial navigation. First affected in Alzheimer's."
    }
  }
};

export const GUIDED_LEARNING = {
  lungs: [
    {
      key: "trachea",
      label: "Trachea",
      anchor: { x: 0, y: 0.47, z: 0.16 }
    },
    {
      key: "bronchi",
      label: "Bronchi",
      anchor: { x: 0.02, y: 0.21, z: 0.18 }
    },
    {
      key: "left_lung",
      label: "Left Lung",
      anchor: { x: -0.28, y: 0.08, z: 0.18 }
    },
    {
      key: "right_lung",
      label: "Right Lung",
      anchor: { x: 0.28, y: 0.08, z: 0.18 }
    },
    {
      key: "pleura",
      label: "Pleura",
      anchor: { x: 0.34, y: -0.02, z: 0.28 }
    },
    {
      key: "alveoli",
      label: "Alveoli",
      anchor: { x: -0.12, y: -0.1, z: 0.24 }
    },
    {
      key: "diaphragm",
      label: "Diaphragm",
      anchor: { x: 0, y: -0.4, z: 0.12 }
    }
  ]
};
