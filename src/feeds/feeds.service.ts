import { Injectable } from '@nestjs/common';

@Injectable()
export class FeedsService {
    oncstructor() {}
    
    getFeeds() {
        return [
            {
    id: 12,
    content: "봄 같은 날씨 너무 좋아요",
    created_at: "2025-01-11T07:41:56.000Z",
    user: {
      id: 13,
      name: "다미장",
    },
  },
  {
    id: 11,
    content: "코딩은 재밌어!",
    created_at: "2025-01-10T09:30:00.000Z",
    user: {
      id: 12,
      name: "테스터",
    },
  },
  {
    id: 10,
    content: "JS 디버깅 중…",
    created_at: "2025-01-09T10:10:00.000Z",
    user: {
      id: 12,
      name: "테스터",
    },
  },
        ];
    }
}
