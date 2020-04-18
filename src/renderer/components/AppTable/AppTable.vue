<template>
  <table class="table">
      <tr class="table__row--blue">
        <th>ID</th>
        <th>戰績1</th>
        <th>戰績2</th>
        <th>戰績3</th>
        <th>戰績4</th>
      </tr>
      <tr class="table__row">
        <td>
          <p>遊戲名稱</p>
          <p>牌位</p>
          <p>分數</p>
        </td>
        <td>
          <p><span class="icon--defeat"></span></p>
          <p>角色名稱</p>
          <p>12/12/12</p>
          <p>2019/0306</p>
        </td>
        <td>
          <p><span class="icon--defeat"></span></p>
          <p>角色名稱</p>
          <p>12/12/12</p>
          <p>2019/0306</p>
        </td>
        <td>
          <p><span class="icon--win"></span></p>
          <p>角色名稱</p>
          <p>12/12/12</p>
          <p>2019/0306</p>
        </td>
        <td>
          <p><span class="icon--defeat"></span></p>
          <p>角色名稱</p>
          <p>12/12/12</p>
          <p>2019/0306</p>
        </td>
      </tr>
      
  </table>
</template>

<style lang="scss">
  .table {
    width: 80%;
    margin-top: .3rem;
    font-size: .16rem;
    & * {
      color: black;
    }
    &__row {
      width: 100%;
      background-color: #f6f6f6;
      text-align: center;
      &:nth-of-type(odd) {
        background-color: #e9e9e9;
      }
      & *, &--blue * {
        padding: .06rem .12rem;
      }
      &--blue {
        background-color: #2980b9;
        color: #FFF;
      }
    }
  }
  .icon--defeat {
    padding: 0;
    display: inline-block;
    margin: 0 auto;
    font-size: .3rem;
    color: red;
    cursor: pointer;
    &::before {
      content: "\2716";
    }
  }
  .icon--win {
    padding: 0;
    display: inline-block;
    margin: 0 auto;
    font-size: .3rem;
    color: green;
    cursor: pointer;
    &::before {
      content: "\2714";
    }
  }
</style>