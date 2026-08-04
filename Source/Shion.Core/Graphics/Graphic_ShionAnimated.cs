using RimWorld;
using UnityEngine;
using VEF.Graphics;
using Verse;

namespace Shion.Core.Graphics
{
    /// <summary>
    /// Keeps VEF animation active while tolerating RimWorld's plain GraphicData
    /// request when it resolves a build-menu icon.
    /// </summary>
    public sealed class Graphic_ShionAnimated : Graphic_Animated
    {
        private GraphicData_Animated animatedData;

        public override Material MatSingle => CurrentFrame?.MatSingle;

        public override void Init(GraphicRequest req)
        {
            animatedData = req.graphicData as GraphicData_Animated;
            base.Init(req);
        }

        public override void DrawWorker(
            Vector3 loc,
            Rot4 rot,
            ThingDef thingDef,
            Thing thing,
            float extraRotation)
        {
            Graphic frame = CurrentFrame;
            frame?.DrawWorker(loc, rot, thingDef, thing, extraRotation);
        }

        private Graphic CurrentFrame
        {
            get
            {
                if (subGraphics == null || subGraphics.Length == 0)
                {
                    return null;
                }

                if (Current.Game == null || Current.Game.tickManager == null)
                {
                    return subGraphics[0];
                }

                int ticksPerFrame = animatedData == null
                    ? 20
                    : Mathf.Max(1, animatedData.ticksPerFrame);
                int index = (Current.Game.tickManager.TicksGame / ticksPerFrame) % subGraphics.Length;
                return subGraphics[index];
            }
        }
    }
}
