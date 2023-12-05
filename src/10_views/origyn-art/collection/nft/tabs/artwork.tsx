import { Link } from 'react-router-dom';

function OrigynArtCollectionNftArtwork() {
    return (
        <div className="flex p-[20px] md:px-[60px] xl:px-[120px]">
            <div className="mx-auto h-fit w-full  bg-white p-[30px] px-[27px] py-[30px] shadow md:w-2/3">
                <h1 className=" text-[25px] font-medium  md:text-[30px]">About the painting</h1>
                <div className="mt-[10px] text-[15px] leading-[22px] md:mt-[28px]">
                    Suzanne Walking in Leather Skirt is from a body of Julian Opie’s work that bears
                    a close relationship to two works commissioned and exhibited through the
                    ICA/Boston’s{' '}
                    <Link
                        to="https://www.icaboston.org/exhibitions/icavita-brevis-project-julian-opie/"
                        target="_blank"
                        className="underline"
                    >
                        Vita Brevis program
                    </Link>
                    , a series of temporary outdoor art projects launched in 1998. In October 2005,
                    the ICA unveiled two walking portraits by Opie on the Northern Avenue Bridge –
                    Julian Walking and Suzanne Walking – which served as unofficial “ambassadors”
                    for the new ICA building, located a short distance away.
                    <br />
                    <br />
                    The large-scale size of this artwork, painted in 2008, is reminiscent of the
                    artist’s keen interest in intervening in public spaces and outdoor projects.
                    This piece depicts a figure moving with lightness and grace, unceasingly, as in
                    a perpetual and cyclical movement.
                    <br />
                    <br />
                    The face is reduced to a simple sphere and yet her expression seems to emanate
                    from her posture, providing a magnificent example of Opie’s genius in bringing
                    out the character of his figures, despite being devoid of details.
                    <br />
                    <br />
                    This work in vinyl, exemplifies Opie’s signature style of reducing figures and
                    shapes to their most essential outlines using a black line filled with a strong,
                    clear blue color echoing the language of signs and symbols. Amazingly, it is a
                    poignant example of the distinctive style Opie would develop throughout the
                    years.
                </div>
            </div>
        </div>
    );
}

export default OrigynArtCollectionNftArtwork;
