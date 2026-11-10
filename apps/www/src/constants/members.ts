import type { StaticImageData } from "next/image";

import BX_김동영 from "@/assets/images/members/BX_김동영.png";
import BX_홍가민 from "@/assets/images/members/BX_홍가민.png";
import 대외협력_백자영 from "@/assets/images/members/대외협력_백자영.png";
import 대표_왕효준 from "@/assets/images/members/대표_왕효준.png";
import 메이커스_강태성 from "@/assets/images/members/메이커스_강태성.png";
import 메이커스_공희상 from "@/assets/images/members/메이커스_공희상.png";
import 메이커스_권정인 from "@/assets/images/members/메이커스_권정인.jpg";
import 메이커스_김영재 from "@/assets/images/members/메이커스_김영재.png";
import 메이커스_김지훈 from "@/assets/images/members/메이커스_김지훈.jpg";
import 메이커스_김진범 from "@/assets/images/members/메이커스_김진범.png";
import 메이커스_문소희 from "@/assets/images/members/메이커스_문소희.png";
import 메이커스_소효은 from "@/assets/images/members/메이커스_소효은.png";
import 메이커스_이동현 from "@/assets/images/members/메이커스_이동현.png";
import 메이커스_이재호 from "@/assets/images/members/메이커스_이재호.png";
import 메이커스_최원준 from "@/assets/images/members/메이커스_최원준.png";
import 메이커스_한아름 from "@/assets/images/members/메이커스_한아름.jpg";
import 운영_김경욱 from "@/assets/images/members/운영_김경욱.png";
import 운영_박성령 from "@/assets/images/members/운영_박성령.png";
import 운영_정서연 from "@/assets/images/members/운영_정서연.png";
import 인프라_강석준 from "@/assets/images/members/인프라_강석준.png";
import 인프라_허정원 from "@/assets/images/members/인프라_허정원.png";

export type SupporterRole = "대표" | "운영" | "인프라" | "대외협력" | "BX";

export type MakerRole = "프론트엔드" | "백엔드" | "디자인" | "기획";

interface Member {
  name: string;
  image: StaticImageData;
}

export interface Supporter extends Member {
  role: SupporterRole;
}

export interface Maker extends Member {
  role: MakerRole;
  description: string;
}

export const SUPPORTERS: Supporter[] = [
  { name: "왕효준", role: "대표", image: 대표_왕효준 },
  { name: "김경욱", role: "운영", image: 운영_김경욱 },
  { name: "박성령", role: "운영", image: 운영_박성령 },
  { name: "정서연", role: "운영", image: 운영_정서연 },
  { name: "강석준", role: "인프라", image: 인프라_강석준 },
  { name: "허정원", role: "인프라", image: 인프라_허정원 },
  { name: "백자영", role: "대외협력", image: 대외협력_백자영 },
  { name: "김동영", role: "BX", image: BX_김동영 },
  { name: "홍가민", role: "BX", image: BX_홍가민 },
];

export const MAKERS_1: Maker[] = [
  {
    name: "김영재",
    role: "프론트엔드",
    image: 메이커스_김영재,
    description:
      "화면부터 배포까지 서비스가 사용자에게 닿는 전 과정을 고민하며, 탄탄한 프론트엔드 기반을 만들어갑니다.",
  },
  {
    name: "김지훈",
    role: "프론트엔드",
    image: 메이커스_김지훈,
    description:
      "사용자 경험 개선에 관심을 갖고, 젝트 구성원들이 편리하게 사용할 수 있는 서비스를 만들어갑니다.",
  },
  {
    name: "소효은",
    role: "프론트엔드",
    image: 메이커스_소효은,
    description:
      "사용자의 불편을 발견하고 해결하며, 읽기 쉽고 개선하기 좋은 코드를 작성하기 위해 고민합니다.",
  },
  {
    name: "강태성",
    role: "백엔드",
    image: 메이커스_강태성,
    description: "호기심을 바탕으로 깊게 고민하며, 문제의 본질을 찾아 해결합니다.",
  },
  {
    name: "공희상",
    role: "백엔드",
    image: 메이커스_공희상,
    description: "사용자에게 필요한 기능을 실용적으로 구현하고자 고민하며 몰입하고 있습니다.",
  },
  {
    name: "김진범",
    role: "백엔드",
    image: 메이커스_김진범,
    description:
      "얻는 것과 포기하는 것을 고민하며, 구조와 선택의 이유를 함께 남기는 개발을 지향합니다.",
  },
  {
    name: "이재호",
    role: "기획",
    image: 메이커스_이재호,
    description:
      "개발자, 디자이너와 협업해 홈페이지와 백오피스 개발을 조율하며, 프로젝트 목표 달성을 이끌어갑니다.",
  },
  {
    name: "권정인",
    role: "디자인",
    image: 메이커스_권정인,
    description: "사용자가 쉽게 이해하고 편안하게 사용할 수 있도록 화면과 구조를 설계합니다.",
  },
  {
    name: "최원준",
    role: "디자인",
    image: 메이커스_최원준,
    description: "사용자 흐름과 운영을 함께 고려해 프로덕트를 설계하고, 경험의 완성도를 높입니다.",
  },
];

export const MAKERS_2: Maker[] = [
  {
    name: "문소희",
    role: "프론트엔드",
    image: 메이커스_문소희,
    description:
      "디자인 시스템 문서 플랫폼을 구현하며, 사용자가 쉽게 이해하고 활용할 수 있도록 구조와 사용성에 집중합니다.",
  },
  {
    name: "이동현",
    role: "프론트엔드",
    image: 메이커스_이동현,
    description: "일관된 컴포넌트 API를 설계하고, 더 나은 개발자 경험을 만드는 데 집중합니다.",
  },
  {
    name: "한아름",
    role: "프론트엔드",
    image: 메이커스_한아름,
    description:
      "일관된 사용자 경험과 효율적인 개발 환경을 위해 접근성을 고려한 디자인 시스템을 구축하고 개선합니다.",
  },
  {
    name: "김동영",
    role: "디자인",
    image: BX_김동영,
    description: "젝트 BX 및 디자인 시스템(JDS)을 설계하며 긍정적인 협업 경험을 만들어냅니다.",
  },
];
