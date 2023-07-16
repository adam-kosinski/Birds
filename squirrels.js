let squirrel_taxon_obj = {
    "id": 46017,
    "preferred_common_name": "Eastern Gray Squirrel",
    "name": "Sciurus carolinensis",
    "rank": "species",
    "ancestor_ids": [48460, 1, 2, 355675, 40151, 848317, 848320, 848323, 43698, 129411, 45933, 332614, 339575, 45994, 1431493],
    "default_photo": {
        "id": 176023507,
        "license_code": "cc-by",
        "attribution": "(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.",
        "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg",
        "original_dimensions": {
            "height": 1536,
            "width": 2048
        },
        "flags": [],
        "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg",
        "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"
    },
    "wikipedia_url": "http://en.wikipedia.org/wiki/Eastern_gray_squirrel"
}



// fetch("https://api.inaturalist.org/v1/observations/100156616%2C100101006%2C146168718%2C33905804%2C108754814%2C108535369%2C108486315%2C108133035%2C107514828%2C107281826%2C107181397%2C106443851%2C106248098%2C105987750%2C105391003%2C105336838%2C105180645%2C104975967%2C138744327%2C138667160")
// .then(res => res.json())
// .then(data => {
//     let small_results = data.results.map(obj => {
//         return {
//             "id": obj.id,
//             "photos": obj.photos,
//             "taxon": squirrel_taxon_obj,
//             "uri": obj.uri,
//             "sounds": obj.sounds,
//             "is_squirrel_intruder": true
//         }
//     })
//     console.log(JSON.stringify(small_results))
// })

let squirrel_obs = [{"id":100101006,"photos":[],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/100101006","sounds":[{"id":324461,"license_code":"cc-by-nc","attribution":"(c) Diane Bricmont, some rights reserved (CC BY-NC)","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/324461.wav?1635892765","file_content_type":"audio/x-wav","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true},{"id":100156616,"photos":[{"id":167123272,"license_code":"cc0","original_dimensions":{"width":601,"height":417},"url":"https://inaturalist-open-data.s3.amazonaws.com/photos/167123272/square.jpg","attribution":"no rights reserved","flags":[]}],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/100156616","sounds":[{"id":324701,"license_code":"cc0","attribution":"no rights reserved","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/324701.mp3?1635955945","file_content_type":"audio/mpeg","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true},{"id":104975967,"photos":[],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/104975967","sounds":[{"id":346648,"license_code":"cc-by","attribution":"(c) Caitlin Campbell, some rights reserved (CC BY)","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/346648.wav?1642263895","file_content_type":"audio/x-wav","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true},{"id":105180645,"photos":[],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/105180645","sounds":[{"id":347587,"license_code":"cc-by","attribution":"(c) Jennifer Rycenga, some rights reserved (CC BY)","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/347587.wav?1642553592","file_content_type":"audio/x-wav","play_local":true,"subtype":null,"flags":[]},{"id":347565,"license_code":"cc-by","attribution":"(c) Jennifer Rycenga, some rights reserved (CC BY)","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/347565.m4a?1642548591","file_content_type":"audio/mp4","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true},{"id":105336838,"photos":[],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/105336838","sounds":[{"id":348478,"license_code":"cc-by","attribution":"(c) Jennifer Rycenga, some rights reserved (CC BY)","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/348478.wav?1642834742","file_content_type":"audio/x-wav","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true},{"id":105391003,"photos":[],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/105391003","sounds":[{"id":348666,"license_code":"cc-by-nc","attribution":"(c) Phil Stouffer, some rights reserved (CC BY-NC)","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/348666.wav?1642889690","file_content_type":"audio/x-wav","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true},{"id":105987750,"photos":[],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/105987750","sounds":[{"id":352625,"license_code":"cc-by","attribution":"(c) Cecil Smith, some rights reserved (CC BY)","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/352625.wav?1643755079","file_content_type":"audio/x-wav","play_local":true,"subtype":null,"flags":[]},{"id":352633,"license_code":"cc-by","attribution":"(c) Cecil Smith, some rights reserved (CC BY)","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/352633.wav?1643755620","file_content_type":"audio/x-wav","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true},{"id":106248098,"photos":[],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/106248098","sounds":[{"id":354358,"license_code":"cc-by-nc","attribution":"(c) Phil Stouffer, some rights reserved (CC BY-NC)","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/354358.wav?1644163562","file_content_type":"audio/x-wav","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true},{"id":106443851,"photos":[],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/106443851","sounds":[{"id":355366,"license_code":"cc-by-nc","attribution":"(c) emeraldelf, some rights reserved (CC BY-NC)","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/355366.m4a?1644427301","file_content_type":"audio/mp4","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true},{"id":107181397,"photos":[],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/107181397","sounds":[{"id":359958,"license_code":"cc-by-nc","attribution":"(c) Natasha Khan, some rights reserved (CC BY-NC)","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/359958.m4a?1645452560","file_content_type":"audio/mp4","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true},{"id":107281826,"photos":[{"id":180404030,"license_code":"cc0","original_dimensions":{"width":1536,"height":2048},"url":"https://inaturalist-open-data.s3.amazonaws.com/photos/180404030/square.jpg","attribution":"no rights reserved","flags":[]}],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/107281826","sounds":[{"id":360775,"license_code":"cc0","attribution":"no rights reserved","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/360775.m4a?1645570663","file_content_type":"audio/mp4","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true},{"id":107514828,"photos":[{"id":180842369,"license_code":"cc0","original_dimensions":{"width":1536,"height":2048},"url":"https://inaturalist-open-data.s3.amazonaws.com/photos/180842369/square.jpg","attribution":"no rights reserved","flags":[]},{"id":180842378,"license_code":"cc0","original_dimensions":{"width":1536,"height":2048},"url":"https://inaturalist-open-data.s3.amazonaws.com/photos/180842378/square.jpg","attribution":"no rights reserved","flags":[]}],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/107514828","sounds":[{"id":362434,"license_code":"cc0","attribution":"no rights reserved","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/362434.m4a?1645918092","file_content_type":"audio/mp4","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true},{"id":108133035,"photos":[],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/108133035","sounds":[{"id":367327,"license_code":"cc-by-nc","attribution":"(c) dominicaprasad, some rights reserved (CC BY-NC)","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/367327.m4a?1646687120","file_content_type":"audio/mp4","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true},{"id":108486315,"photos":[],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/108486315","sounds":[{"id":369890,"license_code":"cc-by-nc","attribution":"(c) Caleb Centanni, some rights reserved (CC BY-NC)","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/369890.wav?1647148730","file_content_type":"audio/x-wav","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true},{"id":108535369,"photos":[],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/108535369","sounds":[{"id":370188,"license_code":"cc-by-nc","attribution":"(c) robyn2910, some rights reserved (CC BY-NC)","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/370188.m4a?1647205585","file_content_type":"audio/mp4","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true},{"id":108754814,"photos":[{"id":183187444,"license_code":"cc-by-nc","original_dimensions":{"width":2048,"height":1536},"url":"https://inaturalist-open-data.s3.amazonaws.com/photos/183187444/square.jpg","attribution":"(c) OntarioParkers, some rights reserved (CC BY-NC)","flags":[]}],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/108754814","sounds":[{"id":372228,"license_code":"cc-by-nc","attribution":"(c) OntarioParkers, some rights reserved (CC BY-NC)","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/372228.m4a?1647466941","file_content_type":"audio/mp4","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true},{"id":138667160,"photos":[],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/138667160","sounds":[{"id":549158,"license_code":"cc-by-nc","attribution":"(c) Keegan Tuttle-Wheeler, some rights reserved (CC BY-NC)","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/549158.mp3?1665705330","file_content_type":"audio/mpeg","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true},{"id":138744327,"photos":[],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/138744327","sounds":[{"id":549410,"license_code":"cc-by-nc","attribution":"(c) Ken, some rights reserved (CC BY-NC)","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/549410.wav?1665770894","file_content_type":"audio/x-wav","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true},{"id":146168718,"photos":[{"id":251239438,"license_code":"cc-by-nc","original_dimensions":{"width":1898,"height":2048},"url":"https://inaturalist-open-data.s3.amazonaws.com/photos/251239438/square.jpeg","attribution":"(c) Chantel, some rights reserved (CC BY-NC)","flags":[]},{"id":251239458,"license_code":"cc-by-nc","original_dimensions":{"width":1902,"height":2048},"url":"https://inaturalist-open-data.s3.amazonaws.com/photos/251239458/square.jpeg","attribution":"(c) Chantel, some rights reserved (CC BY-NC)","flags":[]},{"id":251239476,"license_code":"cc-by-nc","original_dimensions":{"width":1536,"height":2048},"url":"https://inaturalist-open-data.s3.amazonaws.com/photos/251239476/square.jpeg","attribution":"(c) Chantel, some rights reserved (CC BY-NC)","flags":[]}],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/146168718","sounds":[{"id":582827,"license_code":"cc-by-nc","attribution":"(c) Chantel, some rights reserved (CC BY-NC)","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/582827.wav?1673225969","file_content_type":"audio/x-wav","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true},{"id":33905804,"photos":[],"taxon":{"id":46017,"preferred_common_name":"Eastern Gray Squirrel","name":"Sciurus carolinensis","rank":"species","ancestor_ids":[48460,1,2,355675,40151,848317,848320,848323,43698,129411,45933,332614,339575,45994,1431493],"default_photo":{"id":176023507,"license_code":"cc-by","attribution":"(c) Mila B., some rights reserved (CC BY), uploaded by Mila B.","url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","original_dimensions":{"height":1536,"width":2048},"flags":[],"square_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/square.jpeg","medium_url":"https://inaturalist-open-data.s3.amazonaws.com/photos/176023507/medium.jpeg"},"wikipedia_url":"http://en.wikipedia.org/wiki/Eastern_gray_squirrel"},"uri":"https://www.inaturalist.org/observations/33905804","sounds":[{"id":47979,"license_code":"cc-by-nc","attribution":"(c) anniewang125, some rights reserved (CC BY-NC)","native_sound_id":null,"secret_token":null,"file_url":"https://static.inaturalist.org/sounds/47979.m4a?1648759712","file_content_type":"audio/mp4","play_local":true,"subtype":null,"flags":[]}],"is_squirrel_intruder":true}]