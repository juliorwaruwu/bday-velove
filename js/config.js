/* ============================================================
   EDIT THIS FILE — this is the only file you should need to touch
   ============================================================ */
const CONFIG = {
  yourName: "Julior", // <- put your name here
  partnerName: "Love", // <- put her name here
  age: 19, // <- candles will form this number's shape

  // Each line is typed out character by character. Edit freely, add/remove lines.
  // {name} is auto-replaced with partnerName.
  cakeMessage: "Happy Birthday,\nMy Love",

  birthdayMessage: [
    "Sayang, today the world celebrates you,",
    "but I feel blessed to love you.",

    "You make every ordinary day feel brighter,",
    "with your smile, your laugh, and presence.",

    "I pray that God always keeps you safe,",
    "happy, healthy, and close to your dreams.",

    "Never forget how deeply you are loved,",
    "especially by me, more than you know.",

    "Happy Birthday, my beautiful love.",
    "You are my greatest blessing in life,",
    "my favorite person, my forever choice. ❤️",

    "I love you more than words can express.",
    "Today, tomorrow, and always, I love you.",

  ],

  // Add as many photos as you want. Point src at your own images
  // (in the /images folder, or any URL). Placeholder photos are
  // included so you can see how it looks before swapping them.
  gallery: [
    {
      src: "images/photo1.jpg",
      caption: "The Day We Had Our First Photo Together",
      date: "Chapter One",
      backText:
        "This was the beginning of our beautiful story. It was the day we truly got to know each other. We went to church together, visited the mall, and unexpectedly had our very first date. It was such a wonderful day—we had lunch, got our nails done, and took our first photos together. It was simple, but it became one of my favorite memories. I love you. 💖",
    },

    {
      src: "images/photo2.jpg",
      caption: "It Happened So Suddenly",
      date: "Chapter Two",
      backText:
        "This was our first time hanging out after the long holiday, and everything happened so unexpectedly. We took this photo because our outfits matched so perfectly. Funny enough, our outfits matched quite often. Was it a sign? I believe it was. And now, here we are, happily together.",
    },

    {
      src: "images/photo3.jpg",
      caption: "One of My Most Memorable Days",
      date: "Chapter Three",
      backText:
        "This was one of our first dates after we officially became a couple. It is one of the most beautiful memories I will always keep in my heart. We spent the whole day together and finally shared our relationship with everyone. I was truly happy, and I still smile whenever I think about this day.",
    },

    {
      src: "images/photo4.jpg",
      caption: "Back to High School",
      date: "Chapter Four",
      backText:
        "This day was so much fun. Honestly, it felt like we had gone back to our high school days. Everything felt so simple, exciting, and romantic. Walking beside you made every little moment feel special, and I wish we could relive days like this again and again.",
    },

    {
      src: "images/photo5.jpg",
      caption: "Exchanging Our Love",
      date: "Chapter Five",
      backText:
        "This was our last date before our holiday began. We exchanged gifts, shared laughter, and spent quality time together. It wasn't about how expensive the gifts were—it was about the love and thought behind them. Every little moment with you means the world to me.",
    },

    {
      src: "images/photo6.jpg",
      caption: "Julior's Day",
      date: "Chapter Six",
      backText:
        "One of the most unforgettable memories of my life. I never really cared much about celebrating my birthday, but you showed me how meaningful it could be. Even though it was a simple celebration, it became one of the happiest birthdays I've ever had. Thank you for making me feel so loved. I love you, baby. ❤️",
    },

    {
      src: "images/photo7.jpg",
      caption: "Still My Favorite Person",
      date: "Chapter Seven",
      backText:
        "No matter how much time passes, you'll always be my favorite person. Thank you for every laugh, every hug, every memory, and every little moment we've shared. I hope this is only the beginning of our story. I love you today, tomorrow, and forever. ❤️",
    },

    {
      src: "images/photo8.jpg",
      caption: "First Image of You on my Phone",
      date: "Chapter Eight",
      backText:
        "This one is all laughter — the kind where your eyes disappear and mine follow, and neither of us can remember what started it. I'd trade a thousand quiet moments just for the sound of you laughing like that.",
    },

    {
      src: "images/photo9.jpg",
      caption: "So pretty, So Ordinary",
      date: "Chapter Nine",
      backText:
        "We never needed big plans to make a day unforgettable. Give me you, a sky that can't decide its color, and a little time — and I'll call it perfect. This is what our ordinary, golden hours look like.",
    },

    {
      src: "images/photo10.jpg",
      caption: "You, Being Softly Happy",
      date: "Chapter Ten",
      backText:
        "My favorite version of you lives in this picture — caught mid-smile, not posing, just quietly happy. I hope you know how often I revisit this exact moment when I need a reason to smile.",
    },

    {
      src: "images/photo11.jpg",
      caption: "Rhythm of Love",
      date: "Chapter Eleven",
      backText:
        "Somewhere along the way we stopped being two people in the same place and started being two people in the same heartbeat. Proof that we'll always dance to the same music — even when there's none playing.",
    },

    {
      src: "images/photo12.jpg",
      caption: "Daughter of God and My Love",
      date: "Chapter Twelve",
      backText:
        "Some days feel like a preview of our forever — unhurried, full of nothing and everything all at once. I want a lifetime of borrowed days like this one, every single one of them with you.",
    },

    {
      src: "images/photo13.jpg",
      caption: "Red Love, Quiet Heart",
      date: "Chapter Thirteen",
      backText:
        "While the world got loud, I watched you exist in your own gentle way — and fell a little more in love in the silence. Never stop being soft, my love. It's my favorite thing about you.",
    },

    {
      src: "images/photo14.jpg",
      caption: "Home Is Where You Are",
      date: "Chapter Fourteen",
      backText:
        "Every place feels like home when your hand is in mine. This photo isn't about where we were — it's about where I always want to be: right beside you.",
    },

    {
      src: "images/photo15.jpg",
      caption: "The Safest Room in the World",
      date: "Chapter Fifteen",
      backText:
        "I used to think home was a place. Then I found you, and everywhere with you feels like the safest room in the world. Wherever you are, that's where I belong.",
    },

    {
      src: "images/photo16.jpg",
      caption: "Still Falling, Daily",
      date: "Chapter Sixteen",
      backText:
        "People say the honeymoon phase ends. Ours keeps quietly renewing itself — I catch myself looking at you like it's the first time, over and over. Falling for you never gets old.",
    },

    {
      src: "images/photo17.jpg",
      caption: "Cutie Pie",
      date: "Final Chapter",
      backText:
        "Every chapter so far has been a gift I never knew I deserved. But here's the thing, my love — we're nowhere near the last page. I think the best of us is still unwritten. Happy birthday to my favorite story. Here's to forever. ❤️",
    },

    {
      video: "images/video.mp4",
      caption: "Highschool  Era",
      date: "Video",
      backText:
        "Some moments are too beautiful not to capture on video. This is one of them. 💕",
    },
  ],

  // ─── Romantic lock ───────────────────────────────────────
  // Set enabled:true to protect the surprise with a question
  // only she would know the answer to. answer is case-insensitive.
  lock: {
    enabled: false,
    question: "When is our unforgettable day?",
    answer: "09 february 2026",
    hint: "When we get in relationship? (dd mm(ex.january) yyyy)💕",
    placeholder: "your answer…",
    errorMsg: "Not quite, my love. Try again 💗",
    successMsg: "✨ There's my girl. Welcome. ✨",
  },

  // ─── Music ─────────────────────────────────────────────
  // Drop your song in the project folder as "music.mp3" and it will
  // play via the 🎵 Music button. Or point "src" at any other file
  // name / path / online URL.
  music: {
    src: "music/music.mp3", // <- put your audio file here (mp3, ogg, wav, m4a…)
    volume: 0.4, // 0.0 = silent, 1.0 = max
  },

  // "romantic" = pink & yellow. "midnight" = navy & green.
  // Whatever you set here is the theme shown on first visit;
  // the 🎨 Theme button lets her switch it herself afterwards.
  defaultTheme: "romantic",
};
