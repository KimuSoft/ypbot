<script lang="ts">
  import Button from '@/components/atoms/Button.svelte'
</script>

<div
  class="w-screen flex flex-col lg:flex-row gap-8"
  style="min-height: calc(100vh - 36px)"
>
  <div class="w-full lg:w-2/5 flex flex-col mt-12 lg:mt-0">
    <div class="flex-grow flex justify-center items-center">
      <div class="flex-col lg:w-3/4 px-4">
        <div class="flex lg:flex-col items-center lg:items-start gap-[21px]">
          <div class="text-[48px] lg:text-[128px] font-bold flex-shrink-0">
            위브
          </div>
          <div
            class="text-[18px] lg:text-[36px] lg:max-w-[360px] lg:w-full flex-grow"
          >
            최고의 검열 성능을 가진 한국 디스코드 봇!
          </div>
        </div>
        <div
          class="max-w-[360px] mt-4 lg:mt-24 flex gap-4 justify-center lg:justify-start mx-auto"
        >
          <a href="/app">
            <Button class="bg-red-500 lg:text-2xl lg:px-4 lg:py-2 rounded-lg">
              봇 초대하기
            </Button>
          </a>
          <a href="https://discord.gg/s6wjaRgraJ" target="_blank">
            <Button class="bg-[#5865F2] lg:text-2xl lg:px-4 lg:py-2 rounded-lg">
              공식 디스코드
            </Button>
          </a>
        </div>
      </div>
    </div>
  </div>
  <div class="img" />
</div>

<style lang="scss">
  .img {
    background-image: url('https://cdn.discordapp.com/attachments/858627537994383401/1003496700293435462/a5bef7cc4139d1be.png');
    flex-grow: 1;
    margin-top: 48px;
    background-repeat: no-repeat;
    background-position-x: center;
    background-size: contain;
  }
</style>
