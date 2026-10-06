<script setup lang="ts">
// NAT-1987 surface: the canonical page skeleton (page-patterns §16) on the
// shell-owned gutter. The page's left edge must match the breadcrumb row's
// crumbs at every width — 24px above the phone breakpoint, 12px at/below it.
import { NatcaPageHeader, NatcaCard, NatcaButton } from '@/index'
</script>

<template>
  <div class="natca-page">
    <NatcaPageHeader title="Page gutter" subtitle="class=&quot;natca-page&quot; — the shell owns the gutter (NAT-1987)">
      <template #actions>
        <NatcaButton variant="ghost">Export</NatcaButton>
        <NatcaButton variant="primary">Add member</NatcaButton>
      </template>
    </NatcaPageHeader>

    <section class="natca-page-section">
      <h3 class="section-title">Left edge</h3>
      <p class="section-body">
        This page's content and the breadcrumb row above share one left edge:
        <code>--natca-page-gutter</code> is 24px on desktop and 12px at the
        phone breakpoint (<code>max-width: 768px</code>).
      </p>
      <NatcaCard>
        <p class="section-body">Card content sits inside the page gutter.</p>
      </NatcaCard>
    </section>

    <section class="natca-page-section">
      <h3 class="section-title">Bottom padding</h3>
      <p class="section-body">
        <code>--natca-page-gutter-bottom</code>: 32px on desktop, 24px on phones.
      </p>
    </section>
  </div>
</template>
