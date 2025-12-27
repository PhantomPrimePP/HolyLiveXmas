import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-birthday',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './birthday.html',
  styleUrl: './birthday.scss',
})
export class Birthday {

  currentPage = 1;
  clickCount = 0;

  sounds: HTMLAudioElement[] = [];

  @ViewChild('mainPicture') mainPicture!: ElementRef<HTMLImageElement>;

  constructor(private cdr: ChangeDetectorRef) {
    this.sounds = [
      new Audio('Pictures/AmberLaugh.mp3'),
      new Audio('Pictures/Skill-Issue.mp3'),
      new Audio('Pictures/StinkyAmber.mp3'),
      new Audio('Pictures/AmberLaugh.mp3'),
      new Audio('Pictures/Yay.mp3')
    ];
  }

  onPictureClick() {
    this.clickCount++;

    // Play sound
    if (this.clickCount <= 5) {
      this.sounds[this.clickCount - 1].play();
    }

    // Move image randomly instead of shake
    this.moveToRandomPosition();

    // Switch to page 2 after 5 clicks
    if (this.clickCount === 5) {
      setTimeout(() => {
        this.currentPage = 2;
      }, 500);
    }
  }

  // New function: move picture to random position
  moveToRandomPosition() {
    const pic = this.mainPicture.nativeElement;

    const screenWidth = window.innerWidth - 150;  // minus picture width margin
    const screenHeight = window.innerHeight - 150;

    const randomX = Math.random() * screenWidth;
    const randomY = Math.random() * screenHeight;

    pic.style.position = 'absolute';
    pic.style.left = `${randomX}px`;
    pic.style.top = `${randomY}px`;
  }
  correctAnswers: any = {
  1: 'B',
  2: 'C',
  3: 'C',
  4: 'B',
  5: 'A',
  6: 'C'
};

checkAnswer(questionNum: number, selected: string) {
  const buttons = document.querySelectorAll(
    `.quiz-card:nth-child(${questionNum}) .quiz-option`
  );

  buttons.forEach(btn => {
    (btn as HTMLElement).style.pointerEvents = "none"; // prevent double click
  });

  const isCorrect = this.correctAnswers[questionNum] === selected;

  const clickedButton = event?.target as HTMLElement;

  if (isCorrect) {
    clickedButton.classList.add('correct');
  } else {
    clickedButton.classList.add('wrong');
  }
}


leftImages = [
  'Pictures/Amber6.png',
  'Pictures/Amber2.png',
  'Pictures/Amber3.jpg',
  'Pictures/Amber4.png',
  'Pictures/Amber5.png'
];

rightImages = [
  'Pictures/Amber6.png',
  'Pictures/Amber7.png',
  'Pictures/Amber8.png',
  'Pictures/Amber9.png',
  'Pictures/Amber10.png'
];

leftIndex = 0;
rightIndex = 0;
songStarted = false;
slideshowStarted = false;

@ViewChild('bdaySong') bdaySong!: ElementRef<HTMLAudioElement>;

ngAfterViewChecked() {

  // 🎵 Start the birthday song ONCE when entering Page 5
  if ((this.currentPage === 5 || this.currentPage === 6) && !this.songStarted) {

    const song = this.bdaySong?.nativeElement;
    if (song) {
      song.loop = true;
      song.play();
    }

    this.songStarted = true;
  }

  // 🎞️ Start slideshow ONCE when entering Page 5
  if (this.currentPage === 5 && !this.slideshowStarted) {

    this.startSlideshow();

    this.slideshowStarted = true;
  }
}


startSlideshow() {
  setInterval(() => {
    if (this.currentPage === 5) {
      
      const leftImgEl = document.querySelector('.left-s img') as HTMLElement;
      const rightImgEl = document.querySelector('.right-s img') as HTMLElement;

      // Fade out
      leftImgEl?.classList.add('fade-out');
      rightImgEl?.classList.add('fade-out');

      // After fade-out ends → change image → fade-in
      setTimeout(() => {
        this.leftIndex = (this.leftIndex + 1) % this.leftImages.length;
        this.rightIndex = (this.rightIndex + 1) % this.rightImages.length;

        this.cdr.detectChanges();

        leftImgEl?.classList.remove('fade-out');
        rightImgEl?.classList.remove('fade-out');
      }, 900); // fade duration slightly less than 1s
    }
  }, 5000);
}

friendMessages = [
  {
    name: "Nova",
    text: `HAPPY BIRTHDAY AMBA I LOVE U it been 1 more famboulous year bestie i lovbe u so much this year as been tough but u still fking fighting and am so proud of u <3 no matter what we are always here for u our llittle candy fariy and how u growing as a person and a streamer is amazing 
i lobe u so much amber you are one of my best friend that i can trust and tell anything about i miss u alot but i know uni is imporant and i wish everything is doing good and FIGHTING THOSE PEOPLE >;3 
AND OFC I LOVE U BESTIE HAPPY BIRTHDAY BISH I WILL GIVE U SOME CHOCOLATE`,
    open: false
  },
{
  name: "MEEP MEEP",
  text: `Dear Amber,

Happy 21st birthday! You are now officially related to the 21 meme :) 
I'm sorry I couldn't go to watch the FNAF movie with you today but 
we can try to organise something for sure qwq. 

Serah and I swear an oath to bring you back chocolates from Norway XD 

I miss hanging out with you and look forward to enjoying our 
friendship even more.

Lots of love,  
Marie`,
  open: false
},

  {
    name: "Ken, Karoline, Emanuel and Cynthia",
    text: `Merry Birthday! And a happy new Christmas for you Amber! May your wishes come true and so will the gacha gods too! Me and my family wishes you all the good stuff in the world! Hugs from us!`,
    open: false
  },
  {
    name: "YOUR LOVE - KADE",
    text: "Amber, my sweet beautiful girl. I wish you an amazing birthday today on this joyous occasion. You're officially 21, the legal age of my home country and whenever you visit, can now drink with the family and I. I'm so happy to spend another year with you, although we are apart by over 3500 miles and can't take you out for a birthday celebration date. Keep growing and become a more better person than you already are because I know you're still learning things as the days and years go by. As they say, the older you grow, the wiser you become. I'm happy to have you in my life for another year, and many more to come. Happy birthday, to the shining sunrise of my darkness. ❤️",
    open: false
  },
  {
    name: "Mossman, The Man of Moss (the mossiest moss of the man)",
    text: `Happy Birthday to my Bestie's Bestie! I think i speak for all of us when i say, "christ, what a fookin' year, mate," but we all made it through and im praying for to be better for all of us in the future. You're a hard worker and a great friend, and it shows in everything you do and every interaction that you make. I'm thankful to you for the help you have given me this past year, talking about certain things as well as my 2.0 model, which, while you didn't directly design, you hugely helped me unpackage my ideas so that i could sort out what i really wanted, which was what i really needed at the time.

            Your loud and boisterous, but in the best kind of way, and i hope you never stop being you, because no one else could ever take your place. Cheers for your Birthday, Cheers for the Holidays, and Cheers for the New Years, Warmest regards, Mossman`,
    open: false
  },
  {
    name: "Ann/Andrei ",
    text: `Happy birthday Amber, its ur birthday our best and dearest yapper. I wish you best things, strongest health and everything best to come true because girl u deserve only best things this and next year and years after. Congrats on being able to drink Alcohol now everywhere officially xDD
            Its another year of knowing amazing u and I truly grateful to be ur friend and have u in my life. As much as we both have our life problems and not chatting as much, but ya still one of the best people to chat with and that able to make anyone to laugh. You are absolutely talented, sweet, kind and just very amazing person and friend. You always making me proud and happy to be friend with u and I truly hope things get better for ya and no matter what, u got this all and always will have my support at anything ^^  Oh and ofc when u get better pc or laptop we gotta game more to recall more chaosss hahaha
            Happy birthday once again and love and appreciate u endlessly Amber~ Eat lots of cake 🎂`,
    open: false
  }
];

toggleCard(index: number) {
  this.friendMessages[index].open = !this.friendMessages[index].open;
}

}
