import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/projects', component: () => import('src/pages/projects/ProjectsIndex.vue') },
      {
        path: '/projects/create',
        component: () => import('pages/projects/EditProject.vue'),
        name: 'projects.create',
      },
      { path: '/projects/:id', component: () => import('pages/projects/EditProject.vue') },
      { path: '/scraping', component: () => import('pages/scraping/ScrapingTest.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
