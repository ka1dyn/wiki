# Kaidyn Wiki

## 프로젝트 개요

- 📌 &nbsp; 프로젝트명: Kaidyn Wiki
- 🗓️ &nbsp; 기간: 2026.1.1 ~ 2026.3.4
- ✈️ &nbsp; service url: <a href="https://blog.ka1dyn.com" target="_blank" rel="noopener noreferrer">kaidyn wiki</a>
- ✅ &nbsp; 맡은 역할: 기획, 디자인, 프론트엔드 개발, 배포

## 프로젝트 배경

블로그를 편하게 쓰는 방법이 없을까 고민하던 중 직접 개발해서 글 쓰는 모든 과정을 자동화하하기 위해 시작한 프로젝트이다. 로컬에서 노트 앱인 Obsidian으로 글을 작성하면, 특별히 관리하지 않아도 자동으로 웹 페이지가 생성된다.

핵심 아이디어

- 공부할 때 작성하는 내용과 출판 글을 분리해서 관리
- 콘텐츠는 외부에서 private하게 보호, 내용 수정 시 배포 자동화

## 기술스택

<div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center; min-height: 40px;">
  <img
    src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white"
    alt="Next.js Badge"
    style="display: block; height: 40px; margin: 0;"
  />
  <img
    src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"
    alt="TypeScript Badge"
    style="display: block; height: 40px; margin: 0;"
  />
  <img
    src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white"
    alt="Tailwind CSS Badge"
    style="display: block; height: 40px; margin: 0;"
  />
  <img
    src="https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=61DAFB"
    alt="Zustand Badge"
    style="display: block; height: 40px; margin: 0;"
  />
  <img src="https://img.shields.io/badge/Github_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" style="display: block; height: 40px; margin: 0;" />
  <img
    src="https://img.shields.io/badge/Obsidian-7C3AED?style=for-the-badge&logo=obsidian&logoColor=white"
    alt="Obsidian Badge"
    style="display: block; height: 40px; margin: 0;"
  />
</div>

- Next.js
- Typescript
- Tailwindcss
- Zustand
- Github action
- Obsidian

## 핵심 기술 설명

### 📌 콘텐츠 보호를 위한 구조 설계 및 배포 자동화

- public으로 배포한 프로젝트 repo에 콘텐츠가 포함되지 않도록 private 저장소에 따로 보관
- 프로젝트 내에 통합하기 위해 git submodule 도입
- git의 URL alias를 활용한 vercel private submodule 인증문제 해결
- 셸 스크립트를 통한 콘텐츠 자동 update 추가
- github action과 vercel webhook을 기반으로 한 배포 자동화

### 📌 마크다운 렌더링 파이프라인 구축

페이지 렌더링 흐름

1. obsidian의 플러그인을 활용한 frontmatter 템플릿 자동생성 및 글 작성
2. obsidian git 플러그인을 사용한 auto push
3. prebuild 스크립트를 통한 데이터 준비
   - content repo 최신화, 배포환경에서는 인증 및 clone
   - 이미지 폴더 복사
   - 마크다운 파싱 및 JSON 기반 캐싱, 썸네일 경로 자동 삽입
4. Next.js의 SSG를 활용한 정적 페이지 생성
5. 태그 가로채기를 통한 마크다운 내 이미지 경로 수정
6. 트리 자료구조를 통한 side nav 자동 생성

### 📌 모바일 사용자의 UX를 위한 다양한 반응형 전략

- tailwindcss breakpoint의 폭넓은 사용
- 커스텀 media query 훅을 사용한 코드 재사용
- 반응형 페이지 인디케이터 UI 구현

## UI

1. Hero page
   ![Image](https://github.com/user-attachments/assets/f2c40aab-24c0-4e0a-9412-652abc865bbf)

2. Side Nav
   ![library_nav](https://github.com/user-attachments/assets/a2f3f8f1-c262-492a-ba78-28f95a193213)

3. Posts Page
   ![library_posts](https://github.com/user-attachments/assets/65e3e758-eaef-4da4-a015-007ae9d622dc)

4. Content Page
   ![library_toc](https://github.com/user-attachments/assets/cf2e17ff-82dc-4ebd-ac46-ad6bb60006c7)
