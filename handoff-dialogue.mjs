// Reviewed dialogue with runtime artwork and recording keys.
export const HANDOFF_DIALOGUE = {
  "handoff-church-welcome": {
    "title": "A gift worth practising",
    "chapter": 2,
    "art": "assets/illustrations/church-training-v2.jpg",
    "placement": {
      "type": "tutorial",
      "step": "before-purchase"
    },
    "lines": [
      [
        "Diago",
        "Before the eastern road, we stop here. Courage matters, Sarko. So does learning what to do with it.",
        "serious"
      ],
      [
        "Sarko",
        "I have a shield and a sword. I am less certain about the learning part.",
        "worried"
      ],
      [
        "Diago",
        "Then begin with one lesson. You have two skill points and enough gold. Learn Shield Guard first; that opens the way to Radiant Mark.",
        "warm"
      ],
      [
        "Waiz",
        "Two lessons! Excellent. I once learned three things in a morning. Immediately forgot where I put my swords.",
        "amused"
      ],
      [
        "Diago",
        "Learn the two skills, then equip them. Knowing a technique and preparing it for battle are different things.",
        "serious"
      ]
    ],
    "audioKeys": [
      "handoff-church-welcome-0",
      "handoff-church-welcome-1",
      "handoff-church-welcome-2",
      "handoff-church-welcome-3",
      "handoff-church-welcome-4"
    ]
  },
  "handoff-church-equipped": {
    "title": "Ready, not alone",
    "chapter": 2,
    "art": "assets/illustrations/church-training-v2.jpg",
    "placement": {
      "type": "tutorial",
      "step": "after-equip"
    },
    "lines": [
      [
        "Diago",
        "Good. You may prepare four active skills at once. Basic Attack is always available. Passive skills help without taking an active slot.",
        "warm"
      ],
      [
        "Sarko",
        "So I choose what the company needs, not simply everything I know.",
        "thoughtful"
      ],
      [
        "Diago",
        "Exactly. Each lesson opens the next. Your companions begin with two skills prepared, but all of you still have room to grow.",
        "warm"
      ],
      [
        "Waiz",
        "And before anyone asks, tactical enthusiasm does not use a slot.",
        "amused"
      ]
    ],
    "audioKeys": [
      "handoff-church-equipped-0",
      "handoff-church-equipped-1",
      "handoff-church-equipped-2",
      "handoff-church-equipped-3"
    ]
  },
  "handoff-battle-queue": {
    "title": "A moment to choose",
    "chapter": 2,
    "art": "assets/book/training.jpg",
    "placement": {
      "type": "tutorial",
      "step": "first-battle"
    },
    "lines": [
      [
        "Diago",
        "Watch the portraits and health bars. The small pictures beneath them are your prepared skills. Their numbers show the turns left before they are ready.",
        "serious"
      ],
      [
        "Waiz",
        "Tap a skill on your turn to use it. If you must wait, Use Next queues it. That works in Auto and Manual.",
        "warm"
      ],
      [
        "Diago",
        "A queued skill waits until it is ready. You may change your choice, or pause the battle to think.",
        "warm"
      ],
      [
        "Sarko",
        "And when I learn a healing skill?",
        "thoughtful"
      ],
      [
        "Diago",
        "In Manual, choose a living companion by their portrait and health. In Auto, you help the companion with the lowest current health. A Shepherd watches the whole company.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-battle-queue-0",
      "handoff-battle-queue-1",
      "handoff-battle-queue-2",
      "handoff-battle-queue-3",
      "handoff-battle-queue-4"
    ]
  },
  "handoff-life-welcome": {
    "title": "More than a sword",
    "chapter": 2,
    "art": "assets/illustrations/first-light-town.jpg",
    "placement": {
      "type": "tutorial",
      "step": "first-town-visit"
    },
    "lines": [
      [
        "Waiz",
        "First Light has more to teach than swordplay. Fishing, cooking, woodcutting, mining, forging, and wisdom studies are open to you now.",
        "warm"
      ],
      [
        "Sarko",
        "All of them? I thought I would have to prove myself first.",
        "surprised"
      ],
      [
        "Diago",
        "Begin with simple work. Practice earns the skill for harder tasks. Read a neighbour’s needs before promising supplies.",
        "serious"
      ],
      [
        "Waiz",
        "On an ordinary encounter, choose to fight or help. You cannot claim both rewards. Bosses still need the company to face them.",
        "warm"
      ],
      [
        "Sarko",
        "Then our journey can leave something repaired behind us.",
        "hopeful"
      ]
    ],
    "audioKeys": [
      "handoff-life-welcome-0",
      "handoff-life-welcome-1",
      "handoff-life-welcome-2",
      "handoff-life-welcome-3",
      "handoff-life-welcome-4"
    ]
  },
  "handoff-world-0-0": {
    "title": "Elian · A neighbour on the road",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-elian-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 0,
      "afterStage": 2
    },
    "lines": [
      [
        "Elian",
        "I am Elian. I built this shelter to impress the guild. Then a storm came, and I discovered the roof impressed nobody.",
        "sheepish"
      ],
      [
        "Sarko",
        "Did anyone get hurt?",
        "concerned"
      ],
      [
        "Elian",
        "No. My neighbours held it together while I fetched help. Now I ask who needs shelter before deciding what to build.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-0-0-0",
      "handoff-world-0-0-1",
      "handoff-world-0-0-2"
    ],
    "portraits": {
      "Elian": {
        "art": "assets/illustrations/neighbour-elian-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-0-1": {
    "title": "Elian · The work between us",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-elian-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 0,
      "afterStage": 5
    },
    "lines": [
      [
        "Elian",
        "I used to hide crooked joints beneath the paint. Today I asked an apprentice to check my work. It was harder than lifting the beams.",
        "thoughtful"
      ],
      [
        "Sarko",
        "Diago keeps telling me that needing help is not failure.",
        "warm"
      ],
      [
        "Elian",
        "He is right. Could you bring sound timber when you have practised cutting it? This time we will make something safe together.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-0-1-0",
      "handoff-world-0-1-1",
      "handoff-world-0-1-2"
    ],
    "portraits": {
      "Elian": {
        "art": "assets/illustrations/neighbour-elian-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-0-2": {
    "title": "Elian · A step toward the light",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-elian-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 0,
      "afterStage": 8
    },
    "lines": [
      [
        "Elian",
        "The roof is holding. A weary family is resting beneath it, and nobody has asked who built it.",
        "relieved"
      ],
      [
        "Sarko",
        "Does that trouble you?",
        "warm"
      ],
      [
        "Elian",
        "Not anymore. Carrying one another’s burdens is better work than polishing my name.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-0-2-0",
      "handoff-world-0-2-1",
      "handoff-world-0-2-2"
    ],
    "portraits": {
      "Elian": {
        "art": "assets/illustrations/neighbour-elian-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-1-0": {
    "title": "Marra · A neighbour on the road",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-marra-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 1,
      "afterStage": 3
    },
    "lines": [
      [
        "Marra",
        "Marra, ferry keeper. Mind that loose rope. My brother and I stopped speaking over this landing, and neither of us repaired it.",
        "concerned"
      ],
      [
        "Sarko",
        "Now everyone has to cross a quarrel as well as a river.",
        "warm"
      ],
      [
        "Marra",
        "Yes. I had not thought of it that way.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-1-0-0",
      "handoff-world-1-0-1",
      "handoff-world-1-0-2"
    ],
    "portraits": {
      "Marra": {
        "art": "assets/illustrations/neighbour-marra-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-1-1": {
    "title": "Marra · The work between us",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-marra-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 1,
      "afterStage": 12
    },
    "lines": [
      [
        "Marra",
        "A traveller fell on the landing yesterday. My brother reached him first. I brought blankets before remembering I was angry.",
        "warm"
      ],
      [
        "Sarko",
        "For a moment, you both saw who needed you.",
        "warm"
      ],
      [
        "Marra",
        "I want to keep seeing that. We need timber and a meal for the repair crew. I will ask him to help, not wait for him to apologise.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-1-1-0",
      "handoff-world-1-1-1",
      "handoff-world-1-1-2"
    ],
    "portraits": {
      "Marra": {
        "art": "assets/illustrations/neighbour-marra-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-1-2": {
    "title": "Marra · A step toward the light",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-marra-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 1,
      "afterStage": 17
    },
    "lines": [
      [
        "Marra",
        "We repaired the landing. Then we finally spoke about the argument. One repair did not mend everything, but it gave us a place to begin.",
        "hopeful"
      ],
      [
        "Sarko",
        "You chose to be neighbours again.",
        "warm"
      ],
      [
        "Marra",
        "Mercy was a better crossing than pride.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-1-2-0",
      "handoff-world-1-2-1",
      "handoff-world-1-2-2"
    ],
    "portraits": {
      "Marra": {
        "art": "assets/illustrations/neighbour-marra-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-2-0": {
    "title": "Ansel · A neighbour on the road",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-ansel-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 2,
      "afterStage": 3
    },
    "lines": [
      [
        "Ansel",
        "Ansel. I know this pass better than my own doorstep. That is what I told the last party, just before I walked us into a whiteout.",
        "regretful"
      ],
      [
        "Sarko",
        "What happened?",
        "concerned"
      ],
      [
        "Ansel",
        "A young guide heard the warning bells I would not listen to. She brought us home.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-2-0-0",
      "handoff-world-2-0-1",
      "handoff-world-2-0-2"
    ],
    "portraits": {
      "Ansel": {
        "art": "assets/illustrations/neighbour-ansel-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-2-1": {
    "title": "Ansel · The work between us",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-ansel-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 2,
      "afterStage": 12
    },
    "lines": [
      [
        "Ansel",
        "I have given her the lead today. My pride keeps offering advice nobody asked for.",
        "wry"
      ],
      [
        "Sarko",
        "And what are you doing instead?",
        "warm"
      ],
      [
        "Ansel",
        "Carrying the blankets. Checking the meals. It turns out being useful and being in front are different things.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-2-1-0",
      "handoff-world-2-1-1",
      "handoff-world-2-1-2"
    ],
    "portraits": {
      "Ansel": {
        "art": "assets/illustrations/neighbour-ansel-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-2-2": {
    "title": "Ansel · A step toward the light",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-ansel-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 2,
      "afterStage": 17
    },
    "lines": [
      [
        "Ansel",
        "Everyone reached the shelter. I slipped once, and she caught my arm without making a lesson of it.",
        "grateful"
      ],
      [
        "Sarko",
        "Two can help each other up.",
        "warm"
      ],
      [
        "Ansel",
        "Yes. I have taught that for years. Today I finally let it be true for me.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-2-2-0",
      "handoff-world-2-2-1",
      "handoff-world-2-2-2"
    ],
    "portraits": {
      "Ansel": {
        "art": "assets/illustrations/neighbour-ansel-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-3-0": {
    "title": "Tamar · A neighbour on the road",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-tamar-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 3,
      "afterStage": 3
    },
    "lines": [
      [
        "Tamar",
        "I am Tamar. These bells warn the hill homes when lightning approaches. I once rang them for every rumour.",
        "worried"
      ],
      [
        "Sarko",
        "You wanted to keep everyone safe.",
        "warm"
      ],
      [
        "Tamar",
        "I did. But frightened words travel faster than careful ones. Soon people stopped listening.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-3-0-0",
      "handoff-world-3-0-1",
      "handoff-world-3-0-2"
    ],
    "portraits": {
      "Tamar": {
        "art": "assets/illustrations/neighbour-tamar-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-3-1": {
    "title": "Tamar · The work between us",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-tamar-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 3,
      "afterStage": 12
    },
    "lines": [
      [
        "Tamar",
        "A neighbour brought a warning today. I asked what she had seen, then checked the ridge with her. We found a damaged shelter.",
        "warm"
      ],
      [
        "Sarko",
        "And a real way to help.",
        "warm"
      ],
      [
        "Tamar",
        "We need good metal and patient hands. I am learning to listen before sounding the alarm.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-3-1-0",
      "handoff-world-3-1-1",
      "handoff-world-3-1-2"
    ],
    "portraits": {
      "Tamar": {
        "art": "assets/illustrations/neighbour-tamar-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-3-2": {
    "title": "Tamar · A step toward the light",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-tamar-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 3,
      "afterStage": 17
    },
    "lines": [
      [
        "Tamar",
        "The storm came. The bell rang once, and everyone knew what to do.",
        "relieved"
      ],
      [
        "Sarko",
        "Your voice carried farther because people could trust it.",
        "warm"
      ],
      [
        "Tamar",
        "Being slow to speak does not mean being silent when help is needed. It means making our words worth trusting.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-3-2-0",
      "handoff-world-3-2-1",
      "handoff-world-3-2-2"
    ],
    "portraits": {
      "Tamar": {
        "art": "assets/illustrations/neighbour-tamar-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-4-0": {
    "title": "Ruthen · A neighbour on the road",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-ruthen-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 4,
      "afterStage": 3
    },
    "lines": [
      [
        "Ruthen",
        "Ruthen. Welcome to the least impressive kitchen in the valley. The ash took my ovens, but it left me this pot.",
        "weary"
      ],
      [
        "Sarko",
        "You are still feeding people.",
        "warm"
      ],
      [
        "Ruthen",
        "At first I only promised that everything would be all right. Then a child asked whether all right came with supper.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-4-0-0",
      "handoff-world-4-0-1",
      "handoff-world-4-0-2"
    ],
    "portraits": {
      "Ruthen": {
        "art": "assets/illustrations/neighbour-ruthen-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-4-1": {
    "title": "Ruthen · The work between us",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-ruthen-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 4,
      "afterStage": 12
    },
    "lines": [
      [
        "Ruthen",
        "We have more guests than bowls. I nearly sent a family elsewhere because I was ashamed of what little I could offer.",
        "warm"
      ],
      [
        "Grace",
        "We can find bowls. And wood. And—wait, one thing at a time. What would help most right now?",
        "warm"
      ],
      [
        "Ruthen",
        "Meals made from the fish our neighbours caught. Thank you for asking before rushing in.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-4-1-0",
      "handoff-world-4-1-1",
      "handoff-world-4-1-2"
    ],
    "portraits": {
      "Ruthen": {
        "art": "assets/illustrations/neighbour-ruthen-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-4-2": {
    "title": "Ruthen · A step toward the light",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-ruthen-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 4,
      "afterStage": 17
    },
    "lines": [
      [
        "Ruthen",
        "No one went hungry tonight. We cooked, carried water, and sat with people who missed their homes.",
        "grateful"
      ],
      [
        "Sarko",
        "Hope needed hands as well as words.",
        "warm"
      ],
      [
        "Ruthen",
        "And tomorrow it will need them again. There is room beside the pot whenever you return.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-4-2-0",
      "handoff-world-4-2-1",
      "handoff-world-4-2-2"
    ],
    "portraits": {
      "Ruthen": {
        "art": "assets/illustrations/neighbour-ruthen-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-5-0": {
    "title": "Elior · A neighbour on the road",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-elior-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 5,
      "afterStage": 3
    },
    "lines": [
      [
        "Elior",
        "Elior. Please leave that lantern. It belongs to someone I have not found the courage to face.",
        "ashamed"
      ],
      [
        "Sarko",
        "What happened?",
        "warm"
      ],
      [
        "Elior",
        "I took his oil during a shortage and blamed another neighbour. I have mended the lantern three times to avoid returning it.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-5-0-0",
      "handoff-world-5-0-1",
      "handoff-world-5-0-2"
    ],
    "portraits": {
      "Elior": {
        "art": "assets/illustrations/neighbour-elior-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-5-1": {
    "title": "Elior · The work between us",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-elior-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 5,
      "afterStage": 12
    },
    "lines": [
      [
        "Elior",
        "I told them the truth. Neither thanked me. I wanted to say the confession should have been enough.",
        "regretful"
      ],
      [
        "Sarko",
        "But they were the ones who were hurt.",
        "warm"
      ],
      [
        "Elior",
        "I know. I have offered to replace what I took and repair the neighbour’s lamps. I cannot demand their trust.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-5-1-0",
      "handoff-world-5-1-1",
      "handoff-world-5-1-2"
    ],
    "portraits": {
      "Elior": {
        "art": "assets/illustrations/neighbour-elior-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-5-2": {
    "title": "Elior · A step toward the light",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-elior-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 5,
      "afterStage": 17
    },
    "lines": [
      [
        "Elior",
        "He let me mend a lamp at his door today. He stayed beside me while I worked.",
        "hopeful"
      ],
      [
        "Sarko",
        "A small beginning.",
        "warm"
      ],
      [
        "Elior",
        "An honest one. I cannot undo the lie, but I can stop hiding behind it and choose the truth again tomorrow.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-5-2-0",
      "handoff-world-5-2-1",
      "handoff-world-5-2-2"
    ],
    "portraits": {
      "Elior": {
        "art": "assets/illustrations/neighbour-elior-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-6-0": {
    "title": "Liora · A neighbour on the road",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-liora-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 6,
      "afterStage": 3
    },
    "lines": [
      [
        "Liora",
        "Liora. I used to hurry past this shelter. I wanted to be the first of my companions to see the City clearly.",
        "thoughtful"
      ],
      [
        "Sarko",
        "What made you stop?",
        "warm"
      ],
      [
        "Liora",
        "I found one of them sitting beside the road, too tired to call after me. I had mistaken being ahead for arriving well.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-6-0-0",
      "handoff-world-6-0-1",
      "handoff-world-6-0-2"
    ],
    "portraits": {
      "Liora": {
        "art": "assets/illustrations/neighbour-liora-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-6-1": {
    "title": "Liora · The work between us",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-liora-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 6,
      "afterStage": 12
    },
    "lines": [
      [
        "Liora",
        "Now I keep meals ready for travellers. Some cannot offer anything in return. They apologise for that.",
        "warm"
      ],
      [
        "Sarko",
        "Waiz told me our gifts were never only for ourselves.",
        "warm"
      ],
      [
        "Liora",
        "Then help me make sure nobody has to earn a place at this table.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-6-1-0",
      "handoff-world-6-1-1",
      "handoff-world-6-1-2"
    ],
    "portraits": {
      "Liora": {
        "art": "assets/illustrations/neighbour-liora-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-world-6-2": {
    "title": "Liora · A step toward the light",
    "chapter": 2,
    "art": "assets/illustrations/neighbour-liora-v1.jpg",
    "placement": {
      "type": "world-neighbour",
      "world": 6,
      "afterStage": 17
    },
    "lines": [
      [
        "Liora",
        "Your road leads onward. Mine stays here a little longer; there are travellers still coming.",
        "warm"
      ],
      [
        "Sarko",
        "We will remember your welcome when we see the City.",
        "warm"
      ],
      [
        "Liora",
        "Remember the ones beside you, too. You do not need to be first to walk faithfully toward the light.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-world-6-2-0",
      "handoff-world-6-2-1",
      "handoff-world-6-2-2"
    ],
    "portraits": {
      "Liora": {
        "art": "assets/illustrations/neighbour-liora-v1.jpg",
        "x": 0.08,
        "y": 0.04,
        "w": 0.28
      }
    }
  },
  "handoff-boss-0-9": {
    "title": "Before Stoneheart Warden",
    "chapter": 2,
    "art": "assets/World-Earth.jpg",
    "placement": {
      "type": "boss-hint",
      "world": 0,
      "beforeStage": 10
    },
    "lines": [
      [
        "Diago",
        "Do not rush the stone guard. Let it commit, then follow my opening.",
        "determined"
      ],
      [
        "Sarko",
        "Then I hold the line while you find our moment.",
        "determined"
      ]
    ],
    "audioKeys": [
      "handoff-boss-0-9-0",
      "handoff-boss-0-9-1"
    ]
  },
  "handoff-boss-1-9": {
    "title": "Before Floodfang",
    "chapter": 2,
    "art": "assets/World-Water.jpg",
    "placement": {
      "type": "boss-hint",
      "world": 1,
      "beforeStage": 10
    },
    "lines": [
      [
        "Naomi",
        "Watch the current around its feet. It turns before the charge. My crossbow can catch that opening.",
        "determined"
      ],
      [
        "Sarko",
        "We will give you a clear line.",
        "determined"
      ]
    ],
    "audioKeys": [
      "handoff-boss-1-9-0",
      "handoff-boss-1-9-1"
    ]
  },
  "handoff-boss-1-19": {
    "title": "Before Tidebound Oracle",
    "chapter": 2,
    "art": "assets/World-Water-2.jpg",
    "placement": {
      "type": "boss-hint",
      "world": 1,
      "beforeStage": 20
    },
    "lines": [
      [
        "Naomi",
        "The shell turns before the surge. I can place a bolt in the gap; keep the company together when the water rises.",
        "determined"
      ],
      [
        "Sarko",
        "We will move with you, not against the tide.",
        "determined"
      ]
    ],
    "audioKeys": [
      "handoff-boss-1-19-0",
      "handoff-boss-1-19-1"
    ]
  },
  "handoff-boss-2-9": {
    "title": "Before Icewing",
    "chapter": 2,
    "art": "assets/World-Snow.jpg",
    "placement": {
      "type": "boss-hint",
      "world": 2,
      "beforeStage": 10
    },
    "lines": [
      [
        "Hailey",
        "Its wings lift the snow before it dives. I can follow that movement with my bow.",
        "determined"
      ],
      [
        "Sarko",
        "Call the dive, and I will raise my shield.",
        "determined"
      ]
    ],
    "audioKeys": [
      "handoff-boss-2-9-0",
      "handoff-boss-2-9-1"
    ]
  },
  "handoff-boss-2-19": {
    "title": "Before Frostveil Warden",
    "chapter": 2,
    "art": "assets/World-Snow-2.jpg",
    "placement": {
      "type": "boss-hint",
      "world": 2,
      "beforeStage": 20
    },
    "lines": [
      [
        "Hailey",
        "The whiteout hides its body, but not the rhythm of its charge. Trust my signal.",
        "determined"
      ],
      [
        "Sarko",
        "You watch the distance. I will watch our friends.",
        "determined"
      ]
    ],
    "audioKeys": [
      "handoff-boss-2-19-0",
      "handoff-boss-2-19-1"
    ]
  },
  "handoff-boss-3-9": {
    "title": "Before Thunderstone Colossus",
    "chapter": 2,
    "art": "assets/World-Thunder.jpg",
    "placement": {
      "type": "boss-hint",
      "world": 3,
      "beforeStage": 10
    },
    "lines": [
      [
        "Isaac",
        "That shell braces before the heavy blow. My hammer can answer when its guard opens.",
        "determined"
      ],
      [
        "Sarko",
        "And we will keep you standing long enough to answer.",
        "determined"
      ]
    ],
    "audioKeys": [
      "handoff-boss-3-9-0",
      "handoff-boss-3-9-1"
    ]
  },
  "handoff-boss-3-19": {
    "title": "Before Stormwing Herald",
    "chapter": 2,
    "art": "assets/World-Thunder-2.jpg",
    "placement": {
      "type": "boss-hint",
      "world": 3,
      "beforeStage": 20
    },
    "lines": [
      [
        "Hailey",
        "Do not chase it into the storm. Keep it in sight, and let my arrows reach where our feet cannot.",
        "determined"
      ],
      [
        "Sarko",
        "We will protect your position.",
        "determined"
      ]
    ],
    "audioKeys": [
      "handoff-boss-3-19-0",
      "handoff-boss-3-19-1"
    ]
  },
  "handoff-boss-4-9": {
    "title": "Before Ashhorn Inferno",
    "chapter": 2,
    "art": "assets/World-Fire.jpg",
    "placement": {
      "type": "boss-hint",
      "world": 4,
      "beforeStage": 10
    },
    "lines": [
      [
        "Grace",
        "It commits everything to that charge. I can meet the opening with my longsword. Preferably after it stops trying to turn us into supper.",
        "determined"
      ],
      [
        "Sarko",
        "After the charge. Together.",
        "determined"
      ]
    ],
    "audioKeys": [
      "handoff-boss-4-9-0",
      "handoff-boss-4-9-1"
    ]
  },
  "handoff-boss-4-19": {
    "title": "Before Cinder Crown",
    "chapter": 2,
    "art": "assets/World-Fire-2.jpg",
    "placement": {
      "type": "boss-hint",
      "world": 4,
      "beforeStage": 20
    },
    "lines": [
      [
        "Sarko",
        "Its fury leaves an opening after the heavy strike. I can step in then, but I need the company beside me.",
        "determined"
      ],
      [
        "Grace",
        "You have us, Sarko. One opening, one company.",
        "warm"
      ]
    ],
    "audioKeys": [
      "handoff-boss-4-19-0",
      "handoff-boss-4-19-1"
    ]
  },
  "handoff-boss-5-9": {
    "title": "Before Corrupted Wolf",
    "chapter": 2,
    "art": "assets/World-Shadow.jpg",
    "placement": {
      "type": "boss-hint",
      "world": 5,
      "beforeStage": 10
    },
    "lines": [
      [
        "Waiz",
        "Watch its shoulders, not just its teeth. I know how a wolf turns. Give me room for both blades.",
        "determined"
      ],
      [
        "Sarko",
        "We will cover your way back.",
        "determined"
      ]
    ],
    "audioKeys": [
      "handoff-boss-5-9-0",
      "handoff-boss-5-9-1"
    ]
  },
  "handoff-boss-5-19": {
    "title": "Before Malachar",
    "chapter": 2,
    "art": "assets/World-Shadow-2.jpg",
    "placement": {
      "type": "boss-hint",
      "world": 5,
      "beforeStage": 20
    },
    "lines": [
      [
        "Levi",
        "He wants us frightened and scattered. Hold the formation. I will lead the opening; nobody follows alone.",
        "determined"
      ],
      [
        "Sarko",
        "We have faced him together before. We will do it again.",
        "determined"
      ]
    ],
    "audioKeys": [
      "handoff-boss-5-19-0",
      "handoff-boss-5-19-1"
    ]
  },
  "handoff-boss-6-9": {
    "title": "Before Dawn Guardian",
    "chapter": 2,
    "art": "assets/World-Light.jpg",
    "placement": {
      "type": "boss-hint",
      "world": 6,
      "beforeStage": 10
    },
    "lines": [
      [
        "Levi",
        "Observe before committing. Its ward has a rhythm, and our formation must move as one.",
        "determined"
      ],
      [
        "Sarko",
        "Then we answer with patience, not pride.",
        "determined"
      ]
    ],
    "audioKeys": [
      "handoff-boss-6-9-0",
      "handoff-boss-6-9-1"
    ]
  },
  "handoff-boss-6-19": {
    "title": "Before Rex Draconum",
    "chapter": 2,
    "art": "assets/World-Light-2.jpg",
    "placement": {
      "type": "boss-hint",
      "world": 6,
      "beforeStage": 20
    },
    "lines": [
      [
        "Levi",
        "Rex wants every eye on his strength. Keep yours on the company. When I give the signal, we advance together.",
        "determined"
      ],
      [
        "Sarko",
        "No one left behind.",
        "determined"
      ]
    ],
    "audioKeys": [
      "handoff-boss-6-19-0",
      "handoff-boss-6-19-1"
    ]
  }
};
