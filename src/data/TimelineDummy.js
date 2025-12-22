import img1 from '../assets/thumbnails/img1.png';
import img2 from '../assets/thumbnails/img2.png';
import img3 from '../assets/thumbnails/img3.png';

export const timelineDummy = [
  {
    date: '12월 18일',
    items: [
      {
        id: 1,
        title: '동현꽃',
        author: '김유찬',
        description:
          '우리 귀여운 동현꽃이에용~ 사랑하는 마음으로 보듬어주세요...',
        tags: ['태그', '태그', '태그', '태그'], // 4개이므로 +1 표시됨
        image: img1,
        likes: 17,
        bookmarks: 17,
        views: 19,
      },
      {
        id: 2,
        title: '치즈스틱 맛도리',
        author: '배재현',
        description: '김유찬 치즈스틱 좀 맛도리네요 진짜 맛있었다',
        tags: ['태그', '태그', '태그', '태그', '태그', '태그'], // +3 표시됨
        image: img2,
        likes: 11,
        bookmarks: 5,
        views: 40,
      },
      {
        id: 3,
        title: '트리 이쁘죠',
        author: '정수진',
        description: '퉁명스런 표정으로 그냥 무심하게 툭 찍은 사진입니다',
        tags: ['태그', '태그', '태그', '태그', '태그'],
        image: img3,
        likes: 26,
        bookmarks: 16,
        views: 32,
      },
      {
        id: 4,
        title: '동현꽃',
        author: '김유찬',
        description: '우리 귀여운 동현꽃이에용~ 다시 봐도 너무 귀엽죠?',
        tags: ['행사', '사진'],
        image: img1,
        likes: 13,
        bookmarks: 4,
        views: 39,
      },
      {
        id: 5,
        title: '치즈스틱 맛도리',
        author: '배재현',
        description: '김유찬 치즈스틱 좀 맛도리네요',
        tags: ['일상'],
        image: img2,
        likes: 16,
        bookmarks: 16,
        views: 16,
      },
    ],
  },
  {
    date: '12월 15일',
    items: [
      {
        id: 6,
        title: '동현꽃',
        author: '김유찬',
        description: '우리 귀여운 동현꽃이에용~',
        tags: ['행사', '사진'],
        image: img1,
        likes: 2,
        bookmarks: 4,
        views: 5,
      },
      {
        id: 7,
        title: '치즈스틱 맛도리',
        author: '배재현',
        description: '김유찬 치즈스틱 좀 맛도리네요',
        tags: ['일상'],
        image: img2,
        likes: 52,
        bookmarks: 10,
        views: 100,
      },
    ],
  },
];
