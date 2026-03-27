"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription
} from "@workspace/ui/components/dialog";
import React from "react";

export const DialogWrapper = ({
  trigger,
  title,
  description,
  children
}: {
  trigger: React.ReactNode;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="sm:max-w-11/12 max-w-11/12 md:max-w-5xl "
        onPointerDownOutside={(e) => {
          e.preventDefault();
          console.log("pointer down Outside");
        }}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="-mx-4 scrollbar_styles max-h-[calc(100vh-200px)] overflow-y-auto px-4">
          {children}
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et perferendis neque ea! Voluptatum quibusdam
            doloremque natus? Quisquam exercitationem nemo molestias ducimus distinctio officiis numquam dolorum quidem
            sequi at impedit est necessitatibus soluta, accusamus facilis consequatur vel itaque aliquam enim ratione?
            Distinctio praesentium sint soluta. Odio, illum ipsam asperiores alias cumque est molestiae distinctio
            necessitatibus nihil, doloremque reiciendis vel inventore ut, aliquam totam in? Quasi natus dolorum in
            beatae a adipisci provident odio saepe autem delectus ab, accusamus cum enim voluptates cumque, ullam
            consequuntur neque incidunt quisquam alias sequi quibusdam pariatur. Eum beatae numquam, similique officia
            quod illum architecto iusto laborum voluptate ipsa sunt facilis dolorem deserunt quibusdam, ea aliquid iste
            aliquam, necessitatibus quae quasi quaerat. Explicabo, sed, dicta obcaecati temporibus distinctio earum
            atque rerum nisi soluta maiores velit incidunt maxime nam dolor laboriosam ducimus suscipit, consequatur
            repellat reprehenderit veniam! Iusto, voluptas porro id, labore in quibusdam explicabo eligendi quos omnis
            cumque ipsa aliquam ex nisi et maxime minus. Quas blanditiis, voluptatum earum hic aperiam pariatur
            repudiandae minima. Totam animi delectus praesentium distinctio nemo exercitationem numquam unde veniam
            incidunt excepturi nesciunt quam, labore impedit aperiam consectetur nisi sunt officia eius? Officiis
            laudantium quia labore voluptatum animi nam nesciunt minus eius saepe iure? Excepturi minus obcaecati optio?
            Fugiat nulla fugit sunt sapiente, harum aliquam at saepe veniam cumque consectetur doloremque eveniet quo,
            officia perspiciatis voluptas cupiditate voluptate sed debitis fuga, tempore laborum doloribus iure sint
            reprehenderit. Expedita officia magni ipsa aliquid, cupiditate quisquam aliquam neque maxime aperiam
            repudiandae modi? Laudantium est velit, nesciunt cumque saepe beatae voluptatibus nostrum minima. Eum sit
            nostrum voluptate consectetur quas necessitatibus perferendis possimus? Id, necessitatibus tenetur.
            Consectetur quia facere ducimus maxime maiores suscipit numquam illum tempora, esse dolorum molestias ad
            fugit quae delectus sint animi et incidunt mollitia quaerat repellat, voluptatem officia sequi minus quis.
            Excepturi consequuntur expedita quidem dolore quibusdam quod suscipit obcaecati numquam blanditiis
            perferendis repellendus autem debitis deserunt, minus provident sequi soluta ad laboriosam facere rerum eos
            accusantium labore eum! Repudiandae neque accusantium, blanditiis quas recusandae delectus error, est
            adipisci eum architecto, quae suscipit eaque ab? Quisquam adipisci officia quam, totam cum pariatur, magnam
            asperiores facere molestias iste dolores suscipit atque doloremque qui repudiandae neque, debitis sint
            molestiae delectus nisi similique unde. Porro rerum modi quam voluptatem perferendis possimus fugiat,
            dolore, doloribus eaque asperiores ipsa odit! Non nihil tempore aperiam dolore et voluptas commodi at nulla,
            laudantium dolores omnis aut repudiandae temporibus vel dicta rerum numquam nesciunt corrupti ad rem saepe?
            Voluptates, sunt pariatur. Temporibus, maxime aliquam, nam beatae, labore quos totam expedita placeat
            molestiae sed quasi tempore eveniet voluptatibus assumenda quaerat voluptatum! Consequuntur accusamus
            incidunt error minus ad dolorum, corporis et eius explicabo, recusandae enim cupiditate harum iure?
            Voluptates, impedit. Obcaecati aut quod animi libero totam consequuntur, modi tempore consectetur accusamus
            dolores, voluptas commodi magnam illum dolorum quis deleniti ipsa sed aperiam. Quo facilis necessitatibus
            doloribus doloremque laborum voluptas ipsa, sed eligendi corrupti molestias aliquid voluptates iste, vel
            itaque vitae numquam praesentium officia eius, fuga iusto a quasi nulla quos! Nostrum temporibus repudiandae
            pariatur, impedit incidunt dolor ea necessitatibus culpa dicta eius distinctio iusto nihil architecto unde,
            minima vero ipsa! Quidem magnam dignissimos delectus doloribus similique corporis vitae temporibus? Aliquid
            illum, non rem voluptates voluptatem, officiis incidunt iusto ex alias sint ad dolore veritatis sed quo,
            reprehenderit soluta tenetur nobis vitae consectetur. Cum qui distinctio sunt quam, quos optio quo dolorum
            sint ut, consequuntur placeat. Beatae, temporibus voluptatem! Suscipit, iusto? Delectus totam reiciendis
            nulla numquam aspernatur? Id accusantium corporis architecto totam inventore quis placeat modi alias fuga
            quaerat provident doloribus eum officiis, nostrum ut, recusandae quibusdam animi autem nam fugiat sequi
            incidunt laudantium? At beatae aut tempore eius eveniet unde, quidem provident ab ipsum laboriosam
            recusandae. Repellat provident expedita nostrum ad. Cupiditate dignissimos, alias non deleniti numquam
            tempore eaque, voluptas nesciunt ipsum nemo nisi, totam quibusdam repellendus facilis. Consectetur expedita
            assumenda temporibus, minima sit soluta ea odit aut reprehenderit optio esse illum laudantium repudiandae
            repellendus tenetur accusantium facere? Illo exercitationem nisi provident voluptatem tempore eveniet
            expedita harum voluptas accusantium laborum itaque quibusdam id repellat nobis fugit eligendi voluptates
            ipsa facilis debitis at fuga atque, cupiditate molestiae distinctio. Cum sint numquam id quae illum
            quibusdam perferendis exercitationem iste distinctio doloremque tenetur quasi, vero dolores, dicta tempora
            dolore? Pariatur fugit officiis rem qui ab similique voluptatum dolores iure provident omnis modi ex,
            dolorum quidem vel saepe aliquam non ipsam nam? Nemo maxime nulla delectus, facilis nobis placeat ex aliquam
            tempora labore nostrum voluptate accusamus impedit optio ducimus nisi esse dicta est molestiae illo velit
            corporis, magni minus. Architecto saepe cupiditate quos placeat praesentium iste asperiores ullam esse magni
            sapiente numquam, ad voluptates voluptatum, maiores distinctio eveniet animi amet iure sequi ut, voluptate
            provident. Impedit, eos maxime minima fugit eum nihil voluptas et laudantium odit. Quos ipsum fugiat unde
            debitis molestiae modi quidem, et exercitationem nihil veritatis numquam nulla amet quam quas nobis ipsam
            sint, saepe dolores repellendus doloremque possimus quo? Harum delectus quia temporibus ipsam quas sequi
            magnam similique magni at modi itaque doloremque ullam illum mollitia a quidem fuga doloribus soluta ipsum
            quaerat, aliquid earum aperiam? Blanditiis enim dicta praesentium assumenda aperiam ullam neque dignissimos
            ipsa, molestiae aspernatur earum molestias quo veniam commodi accusamus repudiandae aliquid vitae iste nulla
            labore qui. Est minus doloribus molestias neque? Sint nobis animi doloribus odio voluptatum, eveniet nisi
            vero magnam delectus nulla deserunt corrupti consectetur itaque est asperiores porro libero iusto. Libero
            saepe, laudantium, explicabo ex sequi eaque possimus facilis placeat inventore dolorem officiis aliquid,
            quas molestias alias. Eos, fuga adipisci? Doloremque commodi eligendi omnis, dolores tempore libero, vero
            aut voluptatem, delectus qui ea? Eveniet sint ea iusto aut facere omnis voluptate a beatae vitae, ipsum
            minus corrupti minima sequi ullam nihil impedit corporis cupiditate! Illum tenetur deleniti dignissimos
            autem voluptate numquam doloribus reiciendis voluptatem cumque culpa fugit, neque animi, quis laborum
            adipisci esse officiis laudantium delectus veritatis enim quos itaque. Totam delectus omnis soluta debitis
            distinctio quidem, adipisci eveniet corporis, voluptatibus culpa iure exercitationem dolor veniam. Ipsa eum
            doloremque sit odio culpa vero eos totam numquam hic.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
