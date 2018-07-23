
<script>
  import { CarouselItem } from 'element-ui';

  export default {
    extends: CarouselItem,
    name: 'meebid-carousel-item',
    props: {
      imgUrl: {
        type: String,
        default: ""
      }
    },
    methods: {

    }
  };
</script>
