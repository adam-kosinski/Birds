Better recommendation brainstorming:

For each pair of birds, count how many times the two were confused.

Problem - unbalanced practicing, if some birds are practiced more their counts will be higher even if a person is confusing them a smaller fraction of the time.

Fix this by normalizing by the number of questions asked where it's possible to confuse the two birds (where the question is about one of the two birds, and both birds are present as possible answers)

Problem - what happens if you are studying chip calls, and do one practice set with just two birds for a while, and another with 10 birds all with chip calls? Say you are about equally confused between any pair of any of these birds (to simplify, say you are basically randomly guessing). Consider questions just about cardinals, for sake of argument. Every question is a chance to confuse cardinal with anything else, so the denominator goes up for all pairs with cardinal in them. In the game with a cardinal and an indigo bunting, the number of times cardinal is confused with indigo bunting is 1/2 the questions. So (# times confused / # opportunities to confuse) = 1/2. In the game with ten birds, the number of times cardinal confused with indigo bunting is 1/10 the questions. So (# times confused / # opportunities to confuse) = 1/10. Since the denominator is the same, the small game will make you artificially look better at telling the difference between cardinals and indigo buntings, when this is not the case.

Perhaps the fix to this is to use random guessing as a baseline. Something like observing whether you confuse two birds more than expected on average if you were randomly guessing. This requires a way to estimate expectation if randomly guessing. A simple way is to use the number of birds currently in play. Test - 10 cardinal questions, 10 birds, guess each bird once. If randomly guessing, score is (1 - 1 / 10). If always correct

A related idea - scale our ratio by the number of birds in the current game? This fixes the long problem above (1/2 _2 becomes 1, and 1/10 _ 10 becomes 1, and if you were doing better, e.g. 1/4 confused instead of 1/2, then our number becomes 1/2). This has the weakness of if there are a bunch of other unrelated birds in play that you always get right (so never confuse), they seem like they shouldn't affect how much you're confusing the cardinal and the indigo bunting??

Another (probably right) idea - ignore cases where a bird other than the cardinal or the indigo bunting was identified. These aren't part of the numerator or denominator.

Case study:

- 3 birds in play
- Q1 - correctly identify as cardinal
- Q2 - incorrectly identify as indigo bunting
- Q3 - incorrectly identify as indigo bunting
- Q4 - incorrectly identify as eastern phoebe

- indigo bunting score = 2/3
- eastern phoebe score = 1/2

- Intuitively - indigo bunting was confused twice as much as eastern phoebe.
- Random guessing baseline - indigo bunting confused

Confusion budget:

Given a cardinal question, p(wrong)

confusion score of bird A on cardinal questions = # bird A guesses / (# bird A guesses + # cardinal guesses) \

(1/score) - 1 \
= ((# bird A guesses + # cardinal guesses) / # bird A guesses) - 1 \
= (1 + (# cardinal guesses / # bird A guesses)) - 1 \
= # cardinal guesses / # bird A guesses

p(wrong | cardinal) \
= # non-cardinal guesses / # total relevant guesses \

Set # cardinal guesses to 4. Then can convert score to # bird A guesses, in theory? Possibly a wrong assumption though that # cardinal guesses would be shared across different birds, since as the number of birds increases, the relative number of cardinal guesses decreases. But this is taken care of by my assumption that the score will stay the same no matter the number of birds in play.

Try it:

(1/score) - 1 \
bunting = 1/2, phoebe = 1

Set # cardinal guesses to 1: \
bunting guesses = 2, phoebe guesses = 1

p(wrong | cardinal) = 3 / 4, as desired

To do this analysis properly, it would be best to score directed confusion scores (i.e. score given which bird was correct). Though I wonder, when p(wrong) gets marginalized across all types of bird questions, whether we can use the average confusion score for a pair of birds.

p (wrong | cardinal) = [sum_birds_b: s_cardinal / (1 - s_cardinal)] / same sum + 1 \
p (wrong) = 1/n sum_question_bird_q: sum_birds_b: s_qb / (1- s_qb)

In the sum we have [s_xy / (1 - s_xy)] + [s_yx / (1 - s_yx)] \
= [s_xy (1 - s_yx) + s_yx (1 - s_xy)] / [(1 - s_xy)(1 - s_yx)] \
= [s_xy + s_yx - 2 s_xy s_yx] / [1 - s_xy - s_yx + 2 s_xy s_yx] \
Let a = s_xy + s_yx - 2 s_xy s_yx, then \
= a / (1 - a) \
WAIT I messed up earlier because I calculated sum of other birds' # guesses, not p(wrong), need to fix

So we could treat a as the edge weight for the two species, which would be more principled.

x/(x+1) = s \
x = sx + s \
(1-s)x = s \
x = s / (1-s) = # bird A guesses

From the iNaturalist data, it's clear that often one direction of confusion is much more than the other direction.

---

TODO

Sidescrolling in location search results list
Better UI for selection

---

Consider adjusting N_OBS_PER_TAXON based on number of taxa (fewer taxa = larger threshold b/c more likely to repeat)

Other filtering? Though current sounds are fairly good I think

- do some experimentation listening to with photos vs without photos, and number of identifications
- and evaluate more rigorously the idea that popular recordings are better

Process audio - https://www.youtube.com/watch?v=GYqogvHYn28

- tips for JS: https://stackoverflow.com/questions/22233037/how-to-apply-basic-audio-filter-using-javascript
- CAN'T DO THIS, BLOCKED BY SAME ORIGIN POLICY

Audio filtering

- popular observations are all very good (from a brief test)
- observation comment might mean something had to be clarified?
  - this doesn't seem to be true in general
- observations with more identifications are easier?
- observations without photos - rely only upon sound
- audio clips that aren't that long - less chance of a ton of silence before hearing the bird

Customization

- setting to not include the "other" red herrings
- setting to load sounds distributed how they are in nature, not evenly among taxa

Design goals

Practice identifying bird species based on their calls

- select bird species to practice
- have nonselected species show up too

Practice identifying birds based on appearance

- at the order, family, genus, species levels

Don't rely on downloaded csv for observations (more flexible)
