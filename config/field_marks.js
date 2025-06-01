const FIELD_MARK_CONFIG = {
  "Wing Bars": {
    advanced: false,
    values: {
      yes: {
        description: "Wing Bars",
        photo: "images/wing_bars_yes.png",
        taxa: [
          145245, //Yellow-rumped Warbler
          10247, //American Redstart
          10286, //Black-and-white Warbler
          145238, //Yellow Warbler
          145233, //Northern Parula
          145242, //Palm Warbler
          145244, //Pine Warbler
          145258, //Black-throated Green Warbler
          145239, //Chestnut-sided Warbler
          145231, //Cape May Warbler
          145246, //Yellow-throated Warbler
          145235, //Magnolia Warbler
          145249, //Prairie Warbler
          145240, //Blackpoll Warbler
          145236, //Bay-breasted Warbler
          145237, //Blackburnian Warbler
          73553, //Blue-winged Warbler
          145232, //Cerulean Warbler
          145230, //Kirtland's Warbler
          9807, //Golden-winged Warbler
        ],
      },
      no: {
        description: "No Wing Bars",
        photo: "images/wing_bars_no.png",
        taxa: [
          9721, //Common Yellowthroat
          62550, //Ovenbird
          10729, //Prothonotary Warbler
          145229, //Hooded Warbler
          979753, //Nashville Warbler
          73149, //Northern Waterthrush
          73148, //Louisiana Waterthrush
          979757, //Orange-crowned Warbler
          145275, //Canada Warbler
          72912, //Worm-eating Warbler
          145276, //Wilson's Warbler
          145225, //Kentucky Warbler
          145224, //Mourning Warbler
          10442, //Swainson's Warbler
          10431, //Connecticut Warbler
          979756, //Tennessee Warbler
        ],
      },
    },
    // unclear
    // 199916, //Black-throated Blue Warbler
  },

  "Breast Streaks": {
    advanced: false,
    values: {
      yes: {
        description: "Breast Streaks",
        photo: "images/breast_streaks_yes.jpg",
        taxa: [
          10286, //Black-and-white Warbler
          145240, //Blackpoll Warbler
          979757, //Orange-crowned Warbler - very faint but this differentiates from Tennessee's
          145235, //Magnolia Warbler
          145231, //Cape May Warbler
          145245, //Yellow-rumped Warbler
          145258, //Black-throated Green Warbler
          145246, //Yellow-throated Warbler
          145237, //Blackburnian Warbler
          145244, //Pine Warbler
          145249, //Prairie Warbler
          145242, //Palm Warbler
          62550, //Ovenbird
          73149, //Northern Waterthrush
          73148, //Louisiana Waterthrush
          145275, //Canada Warbler
          145232, //Cerulean Warbler
          145230, //Kirtland's Warbler
        ],
      },
      no: {
        description: "No Breast Streaks",
        photo: "images/breast_streaks_no.png",
        taxa: [
          10729, //Prothonotary Warbler
          72912, //Worm-eating Warbler
          9807, //Golden-winged Warbler
          73553, //Blue-winged Warbler
          979753, //Nashville Warbler
          145233, //Northern Parula
          145239, //Chestnut-sided Warbler - I don't think the chestnut side counts as streaks
          145236, //Bay-breasted Warbler
          9721, //Common Yellowthroat
          145225, //Kentucky Warbler
          145224, //Mourning Warbler
          10431, //Connecticut Warbler
          145229, //Hooded Warbler
          145276, //Wilson's Warbler
          10247, //American Redstart
          979756, //Tennessee Warbler - sometimes hard to tell but distinguishes from Orange crowned
        ],
      },
    },
    // varies, or hard to tell streaks vs. no streaks
    // 199916, //Black-throated Blue Warbler
    // 10442, //Swainson's Warbler
    // 145238, //Yellow Warbler
  },

  "Line Through Eye": {
    advanced: false,
    values: {
      yes: {
        description: "Eyeline",
        photo: "images/eye_line_yes.jpg",
        taxa: [
          145242, //Palm Warbler
          145244, //Pine Warbler
          145258, //Black-throated Green Warbler
          145231, //Cape May Warbler
          145249, //Prairie Warbler
          979756, //Tennessee Warbler
          145246, //Yellow-throated Warbler
          145237, //Blackburnian Warbler
          73149, //Northern Waterthrush
          73148, //Louisiana Waterthrush
          979757, //Orange-crowned Warbler
          73553, //Blue-winged Warbler
          72912, //Worm-eating Warbler
          10442, //Swainson's Warbler
        ],
      },
      no: {
        description: "No Eyeline",
        photo: "images/eye_line_no.jpg",
        taxa: [
          9721, //Common Yellowthroat
          10247, //American Redstart
          145238, //Yellow Warbler
          145233, //Northern Parula
          62550, //Ovenbird
          145235, //Magnolia Warbler
          199916, //Black-throated Blue Warbler
          145239, //Chestnut-sided Warbler
          10729, //Prothonotary Warbler
          145229, //Hooded Warbler
          979753, //Nashville Warbler
          145275, //Canada Warbler
          145276, //Wilson's Warbler
          145225, //Kentucky Warbler
          145224, //Mourning Warbler - faint slightly darker line on female but not really an eyeline
          10431, //Connecticut Warbler
          145230, //Kirtland's Warbler - darkness barely makes it past the eye, so saying no
        ],
      },
    },
    // varies
    // 10286, //Black-and-white Warbler
    // 145240, //Blackpoll Warbler
    // 145236, //Bay-breasted Warbler

    // can be unclear
    // 145232, //Cerulean Warbler - seems to have it, but can be unclear in the male
    // 145245, //Yellow-rumped Warbler - male eye patch can look like a line

    // could be misinterpreted
    // 9807, //Golden-winged Warbler - technically a patch around eye, but at a glance can look like a line
  },
  "Yellow Throat": {
    advanced: true,
    values: {
      yes: {
        description: "Yellow Throat",
        photo: "images/yellow_throat_yes.jpg",
        taxa: [
          145238, //Yellow Warbler
          145233, //Northern Parula
          145246, //Yellow-throated Warbler
          145235, //Magnolia Warbler
          145249, //Prairie Warbler
          73553, //Blue-winged Warbler
          145230, //Kirtland's Warbler
          9721, //Common Yellowthroat
          10729, //Prothonotary Warbler
          979753, //Nashville Warbler
          979757, //Orange-crowned Warbler
          145275, //Canada Warbler
          145276, //Wilson's Warbler
          145225, //Kentucky Warbler
        ],
      },
      no: {
        description: "No Yellow Throat",
        photo: "images/yellow_throat_no.png",
        taxa: [
          145245, //Yellow-rumped Warbler
          10247, //American Redstart
          10286, //Black-and-white Warbler
          199916, //Black-throated Blue Warbler
          145239, //Chestnut-sided Warbler
          145240, //Blackpoll Warbler
          145236, //Bay-breasted Warbler
          145232, //Cerulean Warbler
          62550, //Ovenbird
          73149, //Northern Waterthrush
          73148, //Louisiana Waterthrush
          72912, //Worm-eating Warbler
          9807, //Golden-winged Warbler
          10442, //Swainson's Warbler
          10431, //Connecticut Warbler
        ],
      },
    },
    // it varies for these based on male/female/immature
    // 145237, //Blackburnian Warbler
    // 145229, //Hooded Warbler
    // 145242, //Palm Warbler
    // 145244, //Pine Warbler
    // 145231, //Cape May Warbler
    // 145258, //Black-throated Green Warbler
    // 979756, //Tennessee Warbler
    // 145224, //Mourning Warbler
  },

  "Eye Ring: Full / Broken / None": {
    advanced: true,
    values: {
      full: {
        description: "Full Eye Ring",
        photo: "images/eye_ring_full.jpg",
        taxa: [
          145275, //Canada Warbler
          979753, //Nashville Warbler
          10431, //Connecticut Warbler
          62550, //Ovenbird
        ],
      },
      broken: {
        description: "Broken Eye Ring",
        photo: "images/eye_ring_broken.jpg",
        taxa: [
          145244, //Pine Warbler
          145230, //Kirtland's Warbler
          145233, //Northern Parula
          979757, //Orange-crowned Warbler - sometimes a bit tricky to see

          // broken vs. none - varies or unclear
          9721, //Common Yellowthroat
          10247, //American Redstart
          145238, //Yellow Warbler
          145239, //Chestnut-sided Warbler
          145249, //Prairie Warbler
          10442, //Swainson's Warbler
          145240, //Blackpoll Warbler
          145236, //Bay-breasted Warbler
          145224, //Mourning Warbler
          145245, //Yellow-rumped Warbler
          145235, //Magnolia Warbler
          199916, //Black-throated Blue Warbler
          145242, //Palm Warbler
        ],
      },
      none: {
        description: "No Eye Ring",
        photo: "images/eye_ring_no.jpg",
        taxa: [
          145258, //Black-throated Green Warbler
          145231, //Cape May Warbler
          10729, //Prothonotary Warbler
          73149, //Northern Waterthrush
          73148, //Louisiana Waterthrush
          145229, //Hooded Warbler
          979756, //Tennessee Warbler
          145237, //Blackburnian Warbler
          73553, //Blue-winged Warbler
          72912, //Worm-eating Warbler
          145276, //Wilson's Warbler
          145225, //Kentucky Warbler
          9807, //Golden-winged Warbler
          145232, //Cerulean Warbler
          145246, //Yellow-throated Warbler

          // broken vs. none - varies or unclear
          9721, //Common Yellowthroat
          10247, //American Redstart
          145238, //Yellow Warbler
          145239, //Chestnut-sided Warbler
          145249, //Prairie Warbler
          10442, //Swainson's Warbler
          145240, //Blackpoll Warbler
          145236, //Bay-breasted Warbler
          145224, //Mourning Warbler
          145245, //Yellow-rumped Warbler
          145235, //Magnolia Warbler
          199916, //Black-throated Blue Warbler
          145242, //Palm Warbler
        ],
      },
    },
    // unclear among all three options
    // 10286, //Black-and-white Warbler - they have a full eye ring but is white so can blend in with surrounding feathers
  },
};
