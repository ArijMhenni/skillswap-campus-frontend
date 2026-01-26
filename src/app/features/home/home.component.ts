import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Feature {
  iconPath: string;
  title: string;
  description: string;
}

interface Stat {
  value: string;
  label: string;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

interface Benefit {
  iconPath: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  features: Feature[] = [
    {
      iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      title: 'Partagez vos compétences',
      description: 'Offrez ce que vous connaissez le mieux. Du codage à la cuisine, chaque compétence a de la valeur dans notre communauté.',
    },
    {
      iconPath: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM18 11a3 3 0 1 0 0-6M22 21v-2a4 4 0 0 0-3-3.87',
      title: 'Connectez-vous et apprenez',
      description: 'Trouvez des pairs avec les compétences que vous souhaitez apprendre. Créez des connexions significatives sur le campus.',
    },
    {
      iconPath: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
      title: 'Communication facile',
      description: 'Messagez directement avec les prestataires de compétences. Coordonnez les horaires et les sessions d\'apprentissage.',
    },
    {
      iconPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      title: 'Construisez votre réputation',
      description: 'Gagnez des évaluations et des avis. Votre expertise sera reconnue dans la communauté.',
    },
  ];

  stats: Stat[] = [
    { value: '2,500+', label: 'Utilisateurs actifs' },
    { value: '5,000+', label: 'Compétences partagées' },
    { value: '10,000+', label: 'Échanges réalisés' },
    { value: '4.9', label: 'Note moyenne' },
  ];

  testimonials: Testimonial[] = [
    {
      name: 'Arij Mhenni',
      role: 'Informatique, 4ème année',
      content: 'J\'ai échangé mes compétences en programmation contre des cours de guitare. Maintenant je peux coder ET jouer de la musique !',
      avatar: 'AM',
      rating: 5,
    },
    {
      name: 'Ons Souidi',
      role: 'Administration des affaires, 2ème année',
      content: 'J\'ai trouvé un tuteur d\'espagnol qui avait besoin d\'aide pour les présentations. Situation gagnant-gagnant !',
      avatar: 'OS',
      rating: 5,
    },
    {
      name: 'Oumaima Belgaied',
      role: 'Beaux-Arts, 4ème année',
      content: 'La communauté ici est incroyable. J\'ai tellement appris en partageant mes compétences artistiques.',
      avatar: 'OB',
      rating: 5,
    },
  ];

  benefits: Benefit[] = [
    {
      iconPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
      title: 'Sûr et vérifié',
      description: 'Tous les utilisateurs sont des membres vérifiés du campus. Échangez des compétences en toute confiance.',
    },
    {
      iconPath: 'M12 6v6l4 2M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
      title: 'Planification flexible',
      description: 'Trouvez des compétences qui correspondent à votre disponibilité. Apprenez à votre propre rythme.',
    },
    {
      iconPath: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3',
      title: 'Aucun argent requis',
      description: 'Échange basé sur le temps et les avantages mutuels. Équitable pour tous.',
    },
  ];

  sparklesPath = 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z';
  
  arrowRightPath = 'M5 12h14M12 5l7 7-7 7';

  createRange(num: number): number[] {
    return Array.from({ length: num }, (_, i) => i);
  }
}

